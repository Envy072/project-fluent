import { IsIn } from 'class-validator';

/**
 * The caller-supplied target Engagement Status (M18: "reflects the
 * Learner's progress — In Progress or Reached End"). Per Sprint 5's
 * resolution of M08's open engagement-threshold question, the backend
 * records exactly the status it is given — when a part counts as
 * sufficiently engaged is a Presentation-layer decision for a future
 * sprint, not a rule enforced here.
 */
export class RecordEngagementDto {
  @IsIn(['IN_PROGRESS', 'REACHED_END'])
  status!: 'IN_PROGRESS' | 'REACHED_END';
}
