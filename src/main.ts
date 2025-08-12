import helmet from 'helmet';

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

function parseOrigins(env?: string): string[] {
  return (env ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const nodeEnv = config.get<string>('NODE_ENV');
  const port = config.get<number>('PORT') ?? 3000;
  const origins = parseOrigins(process.env.CORS_ORIGINS);

  app.enableCors({
    origin: origins.length ? origins : '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    // maxAge: 600, // 프리플라이트(Preflight) 10분
    exposedHeaders: ['Content-Disposition'],
  });

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  if (nodeEnv === 'production') {
    app.useLogger(['error', 'warn']);
  } else {
    app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
  }
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port);
  const logger = new Logger('Bootstrap');
  logger.log(`🚀 Server is running on port ${port}`);
  logger.log(`Running Mode: ${nodeEnv}`);
}
bootstrap();
