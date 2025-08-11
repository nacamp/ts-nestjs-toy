import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: 'CONFIG',
      useValue: { dbHost: 'localhost', dbPort: 3306 },
    },
  ],
  exports: ['CONFIG'],
})
export class ConfigModule {}
