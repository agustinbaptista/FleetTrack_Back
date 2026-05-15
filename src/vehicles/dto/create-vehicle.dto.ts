import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty()
  @IsString()
  plate!: string;

  @ApiProperty()
  @IsString()
  model!: string;

  @ApiProperty()
  @IsString()
  driverName!: string;

  @ApiProperty({ required: false, default: 'offline' })
  @IsString()
  status = 'offline';
}

