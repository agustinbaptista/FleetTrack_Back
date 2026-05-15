import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'ABC-123', description: 'Patente o matrícula del vehículo' })
  @IsString()
  plate!: string;

  @ApiProperty({ example: 'Toyota Hilux 2023', description: 'Modelo y marca del vehículo' })
  @IsString()
  model!: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del conductor asignado al vehículo' })
  @IsString()
  driverName!: string;

  @ApiProperty({ required: false, default: 'offline', description: 'Estado actual del vehículo (offline, online)' })
  @IsString()
  status = 'offline';
}

