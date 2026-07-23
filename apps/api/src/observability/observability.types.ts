/**
 * The seven Observability Domains defined by M44 — every business event
 * logged through ObservabilityService is tagged with exactly one of these,
 * so a measurement always traces back to the domain it reflects (M44's
 * Traceability and Context Measurement Principles).
 */
export enum ObservabilityDomain {
  USER_EXPERIENCE = 'user_experience',
  PRODUCT_BEHAVIOUR = 'product_behaviour',
  BUSINESS_FLOWS = 'business_flows',
  AI_BEHAVIOUR = 'ai_behaviour',
  SERVICE_HEALTH = 'service_health',
  OPERATIONAL_HEALTH = 'operational_health',
  INFORMATION_QUALITY = 'information_quality',
}

/**
 * The exact business outcomes M15's Observability Expectations require to
 * be determinable, restated in M36's Observability Principles. Every value
 * here corresponds to one specific outcome from that list — no event name
 * exists here that isn't traceable to a documented Failure Condition or
 * Postcondition from M13/M18.
 */
export const BusinessEvent = {
  AUTH_REGISTER_SUCCEEDED: 'auth.register.succeeded',
  AUTH_REGISTER_FAILED: 'auth.register.failed',
  AUTH_LOGIN_SUCCEEDED: 'auth.login.succeeded',
  AUTH_LOGIN_FAILED: 'auth.login.failed',
  CONFIGURATION_CHANGED: 'configuration.changed',
  SESSION_GENERATION_SUCCEEDED: 'session.generation.succeeded',
  SESSION_GENERATION_FAILED: 'session.generation.failed',
  SESSION_COMPLETED: 'session.completed',
  SESSION_ABANDONED: 'session.abandoned',
  PROGRESS_RECORDED: 'progress.recorded',
} as const;

export type BusinessEventName = (typeof BusinessEvent)[keyof typeof BusinessEvent];

/**
 * Cross-cutting operational events supporting M36's Service Health and
 * Operational Health Monitoring Principles — distinct from BusinessEvent
 * above, which traces exactly to M15's five business outcomes. These
 * reflect request-level behavior common to every endpoint, not one
 * specific Functional Area's outcome.
 */
export const OperationalEvent = {
  HTTP_REQUEST_COMPLETED: 'http.request.completed',
} as const;

export type OperationalEventName = (typeof OperationalEvent)[keyof typeof OperationalEvent];

export type ObservabilityEventName = BusinessEventName | OperationalEventName;
