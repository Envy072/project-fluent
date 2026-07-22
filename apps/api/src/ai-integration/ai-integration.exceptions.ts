/**
 * Raised when the AI Layer's output cannot be parsed into a complete,
 * valid Topic or Session Composition set. Per M21's Failure Handling
 * Principles, the AI Integration Module never hands back partial output —
 * it fails instead, leaving the caller (the future Session Generation
 * Service, per M18) to treat this as GenerateSession's Failure Condition.
 */
export class AiGenerationFailedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AiGenerationFailedException';
  }
}
