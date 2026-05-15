import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Public } from '@/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Registrar un nuevo usuario', description: 'Crea una cuenta de usuario en el sistema.' })
  @ApiCreatedResponse({ description: 'Usuario registrado exitosamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos proporcionados.' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @ApiOperation({ summary: 'Iniciar sesión', description: 'Autentica a un usuario y devuelve un token JWT.' })
  @ApiOkResponse({ description: 'Autenticación exitosa. Devuelve el token JWT.' })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas.' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}

