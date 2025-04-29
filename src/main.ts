import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const nodeEnv = config.get<string>('NODE_ENV');
  const port = config.get<number>('PORT') ?? 3000;
  if (nodeEnv === 'production') {
    app.useLogger(['error', 'warn']);
  } else {
    app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
  }
  await app.listen(port);
  const logger = new Logger('Bootstrap');
  logger.log(`🚀 Server is running on port ${port}`);
  logger.log(`Running Mode: ${nodeEnv}`);
}
bootstrap();
