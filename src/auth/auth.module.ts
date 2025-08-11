import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'SECRET_KEY', // 실제 운영에선 process.env.JWT_SECRET
      signOptions: { expiresIn: '1h' }, // 토큰 만료 1시간
    }),
  ],
  controllers: [AuthController],
  providers: [
    // global guard 설정을 통해 모든 요청에 대해 JWT 인증을 적용
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    AuthService,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
