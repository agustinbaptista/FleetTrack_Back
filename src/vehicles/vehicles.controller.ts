import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesService } from './vehicles.service';

@ApiTags('vehicles')
@ApiBearerAuth()
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({ summary: 'Registrar un nuevo vehículo', description: 'Crea un vehículo. Requiere rol ADMIN u OPERATOR.' })
  @ApiCreatedResponse({ description: 'Vehículo creado exitosamente.' })
  @ApiForbiddenResponse({ description: 'No tienes los permisos necesarios.' })
  @Post()
  create(@Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(dto);
  }

  @ApiOperation({ summary: 'Obtener todos los vehículos', description: 'Retorna una lista con todos los vehículos registrados.' })
  @ApiOkResponse({ description: 'Lista de vehículos devuelta exitosamente.' })
  @Get()
  findAll() {
    return this.vehiclesService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un vehículo por ID', description: 'Busca un vehículo específico por su identificador.' })
  @ApiOkResponse({ description: 'Vehículo encontrado y devuelto.' })
  @ApiNotFoundResponse({ description: 'Vehículo no encontrado.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiOperation({ summary: 'Actualizar un vehículo', description: 'Actualiza los datos de un vehículo existente. Requiere rol ADMIN u OPERATOR.' })
  @ApiOkResponse({ description: 'Vehículo actualizado exitosamente.' })
  @ApiNotFoundResponse({ description: 'Vehículo no encontrado.' })
  @ApiForbiddenResponse({ description: 'No tienes los permisos necesarios.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar un vehículo', description: 'Elimina lógicamente o físicamente un vehículo. Solo ADMIN.' })
  @ApiOkResponse({ description: 'Vehículo eliminado exitosamente.' })
  @ApiNotFoundResponse({ description: 'Vehículo no encontrado.' })
  @ApiForbiddenResponse({ description: 'No tienes los permisos necesarios (Solo ADMIN).' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}

