import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';

@ApiTags('alerts')
@ApiBearerAuth()
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get(':vehicleId')
  findByVehicle(@Param('vehicleId') vehicleId: string) {
    return this.alertsService.findByVehicle(vehicleId);
  }
}

