import { Response } from 'express';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('bad-script')
  getBadScript(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/plain'); // 잘못된 타입
    res.send("console.log('should be blocked by nosniff');");
  }

  @Get(':id/sub/:id2')
  getSubRoute(
    @Param('id', ParseIntPipe) id: number,
    @Param('id2') id2: string,
  ): string {
    return `sub id:${id} id2: ${id2}`;
  }

  @Get('query')
  getQuery(@Query('id') id: string, @Query('id2') id2: string): string {
    return `query id:${id} id2: ${id2}`;
  }
}
