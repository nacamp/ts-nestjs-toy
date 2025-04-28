import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  //private loggedInUsers = new Set<string>();
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService, // 주입
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = this.usersService.findUserByEmail(email);
    if (!user) {
      return { message: 'User not found' };
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      return { message: 'Invalid credentials' };
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }

  logout() {
    // 실제로는 토큰을 만료시키거나, 세션을 끊는 작업
    return { message: 'Logout successful' };
  }
}
