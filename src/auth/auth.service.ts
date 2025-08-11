import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: string;
  email?: string;
}
interface RefreshPayload extends JwtPayload {
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  private refreshTokens = new Map<string, string>(); // userId => refreshToken

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '1h',
    });
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d',
    });

    // 메모리에 저장
    this.refreshTokens.set(user.id, refresh_token);

    return { access_token, refresh_token, id: user.id };
  }

  async refresh(userId: string, refreshToken: string) {
    const storedToken = this.refreshTokens.get(userId);
    if (!storedToken) {
      throw new UnauthorizedException('No refresh token stored');
    }

    if (storedToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token mismatch');
    }

    // JwtPayload로 선언하면 결과는 iat, exp가 추가로 넘어오고 freshPayload 부분에 internal error가 발생한다.
    let payload: RefreshPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    // console.log(JSON.stringify(payload));

    if (payload.sub !== userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //const freshPayload = { email: user.email, sub: userId };
    const freshPayload = { email: payload.email, sub: payload.sub };
    const newAccessToken = this.jwtService.sign(freshPayload, {
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '1h',
    });

    return { access_token: newAccessToken };
  }

  logout(userId: string) {
    this.refreshTokens.delete(userId);
    return { message: 'Logout successful' };
  }
}
