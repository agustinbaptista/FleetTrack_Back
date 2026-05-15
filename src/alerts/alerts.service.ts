import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './alert.entity';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class AlertsService {
  constructor(@InjectRepository(Alert) private readonly alertRepo: Repository<Alert>) {}

  create(dto: CreateAlertDto): Promise<Alert> {
    return this.alertRepo.save(this.alertRepo.create(dto));
  }

  findByVehicle(vehicleId: string): Promise<Alert[]> {
    return this.alertRepo.find({
      where: { vehicleId },
      order: { createdAt: 'DESC' },
      take: 200,
    });
  }
}

