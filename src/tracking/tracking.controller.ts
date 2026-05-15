import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLocationDto } from './dto/create-location.dto';
import { TrackingService } from './tracking.service';

@ApiTags('tracking')
@ApiBearerAuth()
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @ApiOperation({ summary: 'Registrar ubicación', description: 'Registra una nueva posición GPS para un vehículo.' })
  @ApiCreatedResponse({ description: 'Ubicación registrada exitosamente.' })
  @ApiNotFoundResponse({ description: 'Vehículo no encontrado.' })
  @Post('location')
  createLocation(@Body() dto: CreateLocationDto) {
    return this.trackingService.registerLocation(dto);
  }

  @ApiOperation({ summary: 'Obtener historial', description: 'Devuelve el historial de ubicaciones de un vehículo específico.' })
  @ApiOkResponse({ description: 'Historial obtenido correctamente.' })
  @Get('history/:vehicleId')
  getHistory(@Param('vehicleId') vehicleId: string) {
    return this.trackingService.getHistory(vehicleId);
  }

  @ApiOperation({ summary: 'Obtener última ubicación', description: 'Devuelve la posición más reciente conocida de un vehículo.' })
  @ApiOkResponse({ description: 'Última ubicación obtenida correctamente.' })
  @ApiNotFoundResponse({ description: 'No se encontró ubicación para el vehículo.' })
  @Get('latest/:vehicleId')
  getLatest(@Param('vehicleId') vehicleId: string) {
    return this.trackingService.getLatest(vehicleId);
  }
}

