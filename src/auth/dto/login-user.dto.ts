import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty({ message: 'Email é campo obrigatório' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Senha é campo obrigatório' })
  password: string;
}


