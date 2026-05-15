import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';

@ApiTags('alerts')
@ApiBearerAuth()
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @ApiOperation({ summary: 'Obtener alertas de un vehículo', description: 'Devuelve todas las alertas registradas para un vehículo específico (por ejemplo, exceso de velocidad).' })
  @ApiOkResponse({ description: 'Alertas obtenidas correctamente.' })
  @Get(':vehicleId')
  findByVehicle(@Param('vehicleId') vehicleId: string) {
    return this.alertsService.findByVehicle(vehicleId);
  }
}

