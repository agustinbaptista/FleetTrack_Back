import { IsString, IsUUID } from 'class-validator';

export class CreateAlertDto {
  @IsUUID()
  vehicleId!: string;

  @IsString()
  type!: string;

  @IsString()
  message!: string;
}

