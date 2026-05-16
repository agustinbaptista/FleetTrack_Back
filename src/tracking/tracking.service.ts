import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { VehiclesService } from '../vehicles/vehicles.service';
import { RedisService } from '../redis/redis.service';
import { AlertsService } from '../alerts/alerts.service';
import { TrackingGateway } from '../websocket/tracking.gateway';

@Injectable()
export class TrackingService {
  private readonly stopCache = new Map<string, number>();

  constructor(
    @InjectRepository(Location) private readonly locationRepo: Repository<Location>,
    private readonly vehiclesService: VehiclesService,
    private readonly redisService: RedisService,
    private readonly alertsService: AlertsService,
    private readonly trackingGateway: TrackingGateway,
  ) {}

  async registerLocation(dto: CreateLocationDto): Promise<Location> {
    await this.vehiclesService.findOne(dto.vehicleId);
    const location = await this.locationRepo.save(this.locationRepo.create(dto));

    const latestKey = `vehicle:${dto.vehicleId}:latest`;
    const previous = await this.redisService.getJson<{
      latitude: number;
      longitude: number;
    }>(latestKey);

    await this.redisService.setJson(latestKey, {
      ...location,
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
      speed: Number(location.speed),
      fuelLevel: Number(location.fuelLevel),
    });

    await this.redisService.sAdd('vehicles:online', dto.vehicleId);
    await this.redisService.set(`vehicle:${dto.vehicleId}:last_seen`, Date.now().toString());

    if (previous) {
      const meters = this.distanceMeters(
        previous.latitude,
        previous.longitude,
        Number(location.latitude),
        Number(location.longitude),
      );
      await this.redisService.incrByFloat(`vehicle:${dto.vehicleId}:distance_km`, meters / 1000);
    }

    await this.generateAlerts(location);
    this.trackingGateway.emitVehicleLocation(location);
    return location;
  }

  async getHistory(vehicleId: string): Promise<Location[]> {
    return this.locationRepo.find({
      where: { vehicleId },
      order: { createdAt: 'DESC' },
      take: 1000,
    });
  }

  async getLatest(vehicleId: string): Promise<Location | null> {
    const cached = await this.redisService.getJson<Location>(`vehicle:${vehicleId}:latest`);
    if (cached) return cached;

    return this.locationRepo.findOne({
      where: { vehicleId },
      order: { createdAt: 'DESC' },
    });
  }

  private async generateAlerts(location: Location): Promise<void> {
    const speed = Number(location.speed);
    const vehicleId = location.vehicleId;
    if (speed > 120) {
      const alert = await this.alertsService.create({
        vehicleId,
        type: 'SPEED',
        message: `Exceso de velocidad detectado: ${speed} km/h`,
      });
      this.trackingGateway.emitVehicleAlert(alert);
    }

    const now = Date.now();
    if (speed < 1 && location.engineStatus) {
      const started = this.stopCache.get(vehicleId) ?? now;
      this.stopCache.set(vehicleId, started);
      if (now - started > 120000) {
        const alert = await this.alertsService.create({
          vehicleId,
          type: 'STOPPED',
          message: 'Vehiculo detenido por mas de 2 minutos',
        });
        this.trackingGateway.emitVehicleAlert(alert);
      }
    } else {
      this.stopCache.delete(vehicleId);
    }

    const inGeofence =
      Number(location.latitude) >= -34.8 &&
      Number(location.latitude) <= -34.4 &&
      Number(location.longitude) >= -58.6 &&
      Number(location.longitude) <= -58.2;
    if (!inGeofence) {
      const alert = await this.alertsService.create({
        vehicleId,
        type: 'GEOFENCE',
        message: 'Vehiculo fuera de geocerca configurada',
      });
      this.trackingGateway.emitVehicleAlert(alert);
    }
  }

  private distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

