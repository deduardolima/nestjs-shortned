import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from "bcryptjs"
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthResponseDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.hashPassword))) {
      const { hashPassword, ...result } = user;
      return result;
    }
    return null;
  };


  async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    // const currentSpan = this.traceService.getSpan();
    // currentSpan.addEvent('login event');
    // currentSpan.end();
    const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);
    return {
      id: user.id,
      email: user.email,
      access_token,
    };

  };

  async register(email: string, password: string): Promise<AuthResponseDto> {
    const hashedPassword = await this.hash(password)
    const user = await this.usersService.create({ email, hashPassword: hashedPassword });
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    return {
      id: user.id,
      email: user.email,
      access_token,
    }

  }

  private async hash(text: string): Promise<string> {
    const rounds = Number(process.env.BCRYPT_COST)
    const salt = await bcrypt.genSalt(rounds)
    return bcrypt.hash(text, salt);
  }


}
