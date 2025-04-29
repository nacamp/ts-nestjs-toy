import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private refreshTokens = new Map<string, string>(); // userId => refreshToken

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService, // 주입
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      return { message: 'User not found' };
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      return { message: 'Invalid credentials' };
    }

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    // 메모리에 저장
    this.refreshTokens.set(user.id, refresh_token);

    return { access_token, refresh_token, id: user.id };
  }

  async refresh(userId: string, refreshToken: string) {
    const storedToken = this.refreshTokens.get(userId);
    if (!storedToken) {
      throw new Error('No refresh token stored');
    }

    if (storedToken !== refreshToken) {
      throw new Error('Refresh token mismatch');
    }

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const payload = { email: user.email, sub: user.id };
    const newAccessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    return { access_token: newAccessToken };
  }

  logout(userId: string) {
    this.refreshTokens.delete(userId);
    return { message: 'Logout successful' };
  }
}
