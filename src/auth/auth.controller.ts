import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  async refresh(@Body() body: { id: string; refresh_token: string }) {
    return this.authService.refresh(body.id, body.refresh_token);
  }

  @Post('logout')
  logout(@Body() body: { id: string }) {
    return this.authService.logout(body.id);
  }
}
