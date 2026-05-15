import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsUUID, Max, Min } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID UUID del vehículo' })
  @IsUUID()
  vehicleId!: string;

  @ApiProperty({ example: -34.603722, description: 'Latitud geográfica' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty({ example: -58.381592, description: 'Longitud geográfica' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;

  @ApiProperty({ example: 60.5, description: 'Velocidad actual en km/h' })
  @IsNumber()
  @Min(0)
  speed!: number;

  @ApiProperty({ example: 85, description: 'Nivel de combustible en porcentaje (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  fuelLevel!: number;

  @ApiProperty({ example: true, description: 'Estado del motor (true = encendido, false = apagado)' })
  @IsBoolean()
  engineStatus!: boolean;
}

