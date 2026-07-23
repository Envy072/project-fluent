import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockPinoInstance = { info: vi.fn() };
vi.mock('pino', () => ({
  default: vi.fn(() => mockPinoInstance),
}));

describe('ObservabilityService', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('logs a structured event merging the event name, domain, and context', async () => {
    const { ObservabilityService } = await import('../src/observability/observability.service');
    const { ObservabilityDomain, BusinessEvent } =
      await import('../src/observability/observability.types');
    const service = new ObservabilityService();

    service.logEvent(BusinessEvent.SESSION_COMPLETED, ObservabilityDomain.BUSINESS_FLOWS, {
      userId: 'user-1',
      sessionId: 'session-1',
    });

    expect(mockPinoInstance.info).toHaveBeenCalledWith({
      event: 'session.completed',
      domain: 'business_flows',
      userId: 'user-1',
      sessionId: 'session-1',
    });
  });

  it('logs an event with no context as just the event and domain', async () => {
    const { ObservabilityService } = await import('../src/observability/observability.service');
    const { ObservabilityDomain, BusinessEvent } =
      await import('../src/observability/observability.types');
    const service = new ObservabilityService();

    service.logEvent(BusinessEvent.AUTH_LOGIN_FAILED, ObservabilityDomain.BUSINESS_FLOWS);

    expect(mockPinoInstance.info).toHaveBeenCalledWith({
      event: 'auth.login.failed',
      domain: 'business_flows',
    });
  });
});
