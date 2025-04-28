import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization: Bearer 토큰에서 읽어옴
      ignoreExpiration: false, // 만료 체크
      secretOrKey: 'SECRET_KEY', // 실제 운영에선 환경변수로 뺄 것
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
