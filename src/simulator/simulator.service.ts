import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TrackingService } from '../tracking/tracking.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { RedisService } from '../redis/redis.service';
import { TrackingGateway } from '../websocket/tracking.gateway';
import { AppLogger } from '../common/logger/app-logger.service';

type SimVehicle = {
  vehicleId: string;
  lat: number;
  lon: number;
  speed: number;
  fuel: number;
  engineStatus: boolean;
};

@Injectable()
export class SimulatorService implements OnModuleInit, OnModuleDestroy {
  private timer?: NodeJS.Timeout;
  private vehicles: SimVehicle[] = [];

  constructor(
    private readonly trackingService: TrackingService,
    private readonly vehiclesService: VehiclesService,
    private readonly redisService: RedisService,
    private readonly gateway: TrackingGateway,
    private readonly logger: AppLogger,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.bootstrapVehicles();
    this.timer = setInterval(() => {
      void this.tick();
    }, 5000);
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private async bootstrapVehicles(): Promise<void> {
    const existing = await this.vehiclesService.findAll();
    if (existing.length === 0) {
      await this.vehiclesService.create({
        plate: 'SIM-100',
        model: 'Truck-X',
        driverName: 'Driver 1',
        status: 'online',
      });
      await this.vehiclesService.create({
        plate: 'SIM-200',
        model: 'Van-Y',
        driverName: 'Driver 2',
        status: 'online',
      });
    }
    const vehicles = await this.vehiclesService.findAll();
    this.vehicles = vehicles.slice(0, 5).map((v, idx) => ({
      vehicleId: v.id,
      lat: -34.6 + idx * 0.02,
      lon: -58.45 + idx * 0.02,
      speed: 40 + idx * 3,
      fuel: 90 - idx * 5,
      engineStatus: true,
    }));
    this.logger.log(`Simulator initialized with ${this.vehicles.length} vehicles`);
  }

  private async tick(): Promise<void> {
    for (const item of this.vehicles) {
      const disconnected = Math.random() < 0.03;
      if (disconnected) {
        await this.redisService.sRem('vehicles:online', item.vehicleId);
        this.gateway.emitVehicleDisconnected(item.vehicleId);
        continue;
      }
      item.speed = Math.max(0, Math.min(140, item.speed + (Math.random() * 20 - 10)));
      item.fuel = Math.max(0, item.fuel - Math.random() * 0.6);
      item.engineStatus = item.speed > 1;
      item.lat += (Math.random() - 0.5) * 0.01;
      item.lon += (Math.random() - 0.5) * 0.01;

      await this.trackingService.registerLocation({
        vehicleId: item.vehicleId,
        latitude: item.lat,
        longitude: item.lon,
        speed: Number(item.speed.toFixed(2)),
        fuelLevel: Number(item.fuel.toFixed(2)),
        engineStatus: item.engineStatus,
      });
    }
  }
}

