import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsUUID, Max, Min } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty()
  @IsUUID()
  vehicleId!: string;

  @ApiProperty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  speed!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  fuelLevel!: number;

  @ApiProperty()
  @IsBoolean()
  engineStatus!: boolean;
}

