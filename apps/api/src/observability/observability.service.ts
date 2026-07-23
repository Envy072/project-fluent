import { Injectable } from '@nestjs/common';
import pino, { type Logger } from 'pino';
import type { ObservabilityDomain, ObservabilityEventName } from './observability.types';

/**
 * Realizes M44's Observability Domains and M36's Observability Principles:
 * every business outcome M15 requires to be determinable is emitted here
 * as a structured, consistently-shaped log event to stdout — exactly what
 * a Datadog Agent (ADR-011) tails in production. No Datadog SDK, Agent, or
 * API key is wired up this sprint (no credentials exist yet); this is the
 * instrumentation the Agent would forward once one is configured.
 *
 * Never receives more than M15's Observability Expectations and M22/M35's
 * Data Minimization principles allow — callers pass only identifiers
 * (e.g. userId, sessionId) and already-non-sensitive business values
 * (English Level, Learning Goal, outcome), never email, password, or
 * generated Session content.
 */
@Injectable()
export class ObservabilityService {
  private readonly logger: Logger;

  constructor() {
    this.logger = pino({ level: process.env.NODE_ENV === 'test' ? 'silent' : 'info' });
  }

  logEvent(
    event: ObservabilityEventName,
    domain: ObservabilityDomain,
    context: Record<string, unknown> = {},
  ): void {
    this.logger.info({ event, domain, ...context });
  }
}
