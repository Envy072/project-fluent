import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { tap } from 'rxjs/operators';
import { ObservabilityService } from './observability.service';
import { ObservabilityDomain, OperationalEvent } from './observability.types';

/**
 * Realizes M36's "Service Health" and "Operational Health" Monitoring
 * Principles: whether each Service continues fulfilling its Operations,
 * and whether the system remains Reliable and Available, both require
 * knowing how every request actually resolved — not only the specific
 * business outcomes logged within each service.
 */
@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly observability: ObservabilityService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => this.logRequest(request, response.statusCode, startedAt),
        error: (error: unknown) => {
          const statusCode =
            typeof (error as { status?: number })?.status === 'number'
              ? (error as { status: number }).status
              : 500;
          this.logRequest(request, statusCode, startedAt);
        },
      }),
    );
  }

  private logRequest(request: Request, statusCode: number, startedAt: number): void {
    this.observability.logEvent(
      OperationalEvent.HTTP_REQUEST_COMPLETED,
      ObservabilityDomain.SERVICE_HEALTH,
      {
        method: request.method,
        path: request.route?.path ?? request.path,
        statusCode,
        durationMs: Date.now() - startedAt,
      },
    );
  }
}
