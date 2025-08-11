import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: 'DEMO_CONFIG',
      useValue: { demo1: 'demo1 value', demo2: 2222 },
    },
  ],
  exports: ['DEMO_CONFIG'],
})
export class ConfigModule {}
