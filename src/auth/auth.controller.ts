import { Controller, Post, Body, UseGuards, UnauthorizedException, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiCommonResponses } from 'src/error/api.response';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto, CreateAuthDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Criação de novo usuário', description: 'Endpoint para registrar novo usuário' })
  @ApiOkResponse({ description: 'Usuário criado com sucesso', type: AuthResponseDto })
  async register(@Body() createUserDto: CreateAuthDto) {
    return this.authService.register(createUserDto.email, createUserDto.password);
  }

  @Post('login')
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Login do usuário', description: 'Endpoint para login' })
  @ApiOkResponse({ description: 'Usuário logado com sucesso', type: AuthResponseDto })
  async login(@Body() loginDto: LoginUserDto) {

    return this.authService.login(loginDto);
  }


  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
