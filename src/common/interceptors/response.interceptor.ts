import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

interface RequestWithId extends Request {
  requestId?: string;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<RequestWithId>();
    const requestId = req.requestId;

    return next.handle().pipe(
      map((data: unknown) => {
        return {
          success: true,
          requestId,
          data,
        };
      }),
    );
  }
}
