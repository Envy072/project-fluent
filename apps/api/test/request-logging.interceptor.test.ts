import { describe, expect, it, vi } from 'vitest';
import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, throwError, firstValueFrom } from 'rxjs';
import { RequestLoggingInterceptor } from '../src/observability/request-logging.interceptor';
import type { ObservabilityService } from '../src/observability/observability.service';

function buildObservabilityServiceMock() {
  return { logEvent: vi.fn() } as unknown as ObservabilityService;
}

function buildExecutionContext(request: unknown, response: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
    }),
  } as unknown as ExecutionContext;
}

describe('RequestLoggingInterceptor', () => {
  it('logs the completed request with method, path, status, and duration', async () => {
    const observability = buildObservabilityServiceMock();
    const interceptor = new RequestLoggingInterceptor(observability);
    const context = buildExecutionContext(
      { method: 'POST', path: '/sessions', route: { path: '/sessions' } },
      { statusCode: 201 },
    );
    const next: CallHandler = { handle: () => of({ id: 'session-1' }) };

    await firstValueFrom(interceptor.intercept(context, next));

    expect(observability.logEvent).toHaveBeenCalledWith(
      'http.request.completed',
      'service_health',
      expect.objectContaining({ method: 'POST', path: '/sessions', statusCode: 201 }),
    );
  });

  it('logs the request status from a thrown HTTP exception', async () => {
    const observability = buildObservabilityServiceMock();
    const interceptor = new RequestLoggingInterceptor(observability);
    const context = buildExecutionContext(
      { method: 'POST', path: '/sessions', route: { path: '/sessions' } },
      { statusCode: 200 },
    );
    const next: CallHandler = {
      handle: () => throwError(() => ({ status: 409, message: 'Conflict' })),
    };

    await expect(firstValueFrom(interceptor.intercept(context, next))).rejects.toBeTruthy();

    expect(observability.logEvent).toHaveBeenCalledWith(
      'http.request.completed',
      'service_health',
      expect.objectContaining({ method: 'POST', path: '/sessions', statusCode: 409 }),
    );
  });

  it('falls back to path when no matched route is present', async () => {
    const observability = buildObservabilityServiceMock();
    const interceptor = new RequestLoggingInterceptor(observability);
    const context = buildExecutionContext(
      { method: 'GET', path: '/does-not-exist' },
      { statusCode: 404 },
    );
    const next: CallHandler = { handle: () => of(null) };

    await firstValueFrom(interceptor.intercept(context, next));

    expect(observability.logEvent).toHaveBeenCalledWith(
      'http.request.completed',
      'service_health',
      expect.objectContaining({ method: 'GET', path: '/does-not-exist', statusCode: 404 }),
    );
  });
});
