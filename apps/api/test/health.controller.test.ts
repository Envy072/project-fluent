import { describe, expect, it, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../src/health/health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = moduleRef.get(HealthController);
  });

  it('returns an ok status with an ISO timestamp', () => {
    const result = controller.check();
    expect(result.status).toBe('ok');
    expect(typeof result.uptimeSeconds).toBe('number');
    expect(() => new Date(result.timestamp).toISOString()).not.toThrow();
  });
});
