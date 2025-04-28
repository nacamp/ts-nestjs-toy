import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  private loggedInUsers = new Set<string>();

  login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    if (email === 'test@example.com' && password === 'password') {
      this.loggedInUsers.add(email);
      return { message: 'Login successful' };
    } else {
      return { message: 'Invalid credentials' };
    }
  }

  logout() {
    // 실제로는 토큰을 만료시키거나, 세션을 끊는 작업
    return { message: 'Logout successful' };
  }
}
