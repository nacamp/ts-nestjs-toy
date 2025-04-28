import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  //private loggedInUsers = new Set<string>();
  constructor(private readonly jwtService: JwtService) {}

  // login(loginDto: LoginDto) {
  //   const { email, password } = loginDto;
  //   if (email === 'test@example.com' && password === 'password') {
  //     this.loggedInUsers.add(email);
  //     return { message: 'Login successful' };
  //   } else {
  //     return { message: 'Invalid credentials' };
  //   }
  // }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 더미 사용자 체크
    if (email === 'test@example.com' && password === 'password') {
      console.log('Login successful');
      const payload = { email, sub: 1 }; // sub: 유저 ID라고 생각
      const token = this.jwtService.sign(payload);
      return { access_token: token };
    } else {
      console.log('111Login successful');
      return { message: 'Invalid credentials' };
    }
  }

  logout() {
    // 실제로는 토큰을 만료시키거나, 세션을 끊는 작업
    return { message: 'Logout successful' };
  }
}
