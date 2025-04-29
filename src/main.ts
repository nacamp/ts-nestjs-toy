import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve( process.env.NODE_ENV === 'production' ? '.env' : '.development.env')
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(`Server is running. port: ${process.env.PORT}`);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
