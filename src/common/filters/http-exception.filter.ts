// HttpExceptionFilter
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

type ValidationDetail = { field: string; message: string };

type ErrorResponseShape = {
  message?: string;
  code?: string;
  [key: string]: unknown;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request & { requestId?: string }>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // HttpException.getResponse(): string | object
    const base = isHttp ? exception.getResponse() : null;

    const message =
      typeof base === 'string'
        ? base
        : ((base as ErrorResponseShape)?.message ??
          (isHttp ? exception.message : 'Internal server error'));

    // class-validator 오류 매핑
    const details: ValidationDetail[] | undefined =
      this.extractValidationDetails(base);

    // 서비스 에러코드(있다면): HttpException 응답 객체에 code 삽입해 두면 잡아줌
    let code: string | undefined;
    if (
      typeof base === 'object' &&
      base !== null &&
      'code' in base &&
      typeof (base as { code?: unknown }).code === 'string'
    ) {
      code = (base as { code: string }).code;
    }

    res.status(status).json({
      success: false,
      requestId: req.requestId,
      error: {
        statusCode: status,
        code,
        message,
        ...(details ? { details } : {}),
        // path: req.originalUrl,
        // method: req.method,
      },
    } as const);
  }

  private extractValidationDetails(
    base: unknown,
  ): ValidationDetail[] | undefined {
    if (!base || typeof base !== 'object') return undefined;

    const maybeMessage = (base as { message?: unknown }).message;

    // 1) message: string[]
    if (
      Array.isArray(maybeMessage) &&
      maybeMessage.every((m) => typeof m === 'string')
    ) {
      return maybeMessage.map((m) => ({ field: '', message: m }));
    }

    // 2) message: ValidationError[] 형태 비슷한 구조
    if (
      Array.isArray(maybeMessage) &&
      maybeMessage.length > 0 &&
      maybeMessage.every(
        (m) =>
          typeof m === 'object' &&
          m !== null &&
          'property' in m &&
          typeof (m as { property?: unknown }).property === 'string' &&
          'constraints' in m &&
          (typeof (m as { constraints?: unknown }).constraints === 'object' ||
            typeof (m as { constraints?: unknown }).constraints ===
              'undefined'),
      )
    ) {
      return maybeMessage.flatMap((m) => {
        const constraints =
          (m as { constraints?: Record<string, unknown> }).constraints ?? {};
        return Object.values(constraints)
          .filter((msg) => typeof msg === 'string')
          .map((msg) => ({
            field: (m as { property: string }).property,
            message: msg,
          }));
      });
    }

    return undefined;
  }
}
