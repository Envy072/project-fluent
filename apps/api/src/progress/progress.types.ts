import type { ProgressOutcome } from '../../generated/prisma/client';

/**
 * GetMostRecentOutcome's response (M18): the Learner's most recent Progress
 * Record, or an explicit indication that no Session has ever been
 * generated — never a guessed or defaulted outcome.
 */
export type MostRecentOutcomeResponse =
  | { hasGeneratedSession: false }
  | { hasGeneratedSession: true; sessionId: string; outcome: ProgressOutcome };
