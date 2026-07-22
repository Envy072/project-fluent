import { describe, expect, it, vi } from 'vitest';
import { ConfigService } from '@nestjs/config';
import { anthropicClientProvider } from '../src/ai-integration/anthropic-client.provider';

function buildConfigServiceMock(overrides: Record<string, string> = {}) {
  return {
    get: vi.fn((key: string) => overrides[key]),
  } as unknown as ConfigService;
}

describe('anthropicClientProvider', () => {
  it('constructs an Anthropic client when ANTHROPIC_API_KEY is set', () => {
    const factory = (anthropicClientProvider as { useFactory: (config: ConfigService) => unknown })
      .useFactory;
    const config = buildConfigServiceMock({ ANTHROPIC_API_KEY: 'a-fake-key' });

    expect(() => factory(config)).not.toThrow();
  });

  it('throws when ANTHROPIC_API_KEY is missing', () => {
    const factory = (anthropicClientProvider as { useFactory: (config: ConfigService) => unknown })
      .useFactory;
    const config = buildConfigServiceMock();

    expect(() => factory(config)).toThrow('ANTHROPIC_API_KEY must be set');
  });
});
