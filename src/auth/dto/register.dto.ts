import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'operador@tracking.com', description: 'Correo electrónico para el nuevo usuario' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'operator123', description: 'Contraseña (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ enum: Role, required: false, description: 'Rol opcional del usuario (por defecto asume USER si la lógica lo permite)' })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

