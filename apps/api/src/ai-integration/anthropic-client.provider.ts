import Anthropic from '@anthropic-ai/sdk';
import { ConfigService } from '@nestjs/config';
import type { Provider } from '@nestjs/common';

export const ANTHROPIC_CLIENT = Symbol('ANTHROPIC_CLIENT');

/**
 * Constructs the Anthropic Claude API client (ADR-003) from the environment
 * exactly once, mirroring AuthModule's JwtModule.registerAsync pattern:
 * fail fast at startup if the secret is missing, rather than at first use.
 */
export const anthropicClientProvider: Provider = {
  provide: ANTHROPIC_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService): Anthropic => {
    const apiKey = config.get<string>('ANTHROPIC_API_KEY');
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY must be set to use the AI Integration Module.');
    }
    return new Anthropic({ apiKey });
  },
};
