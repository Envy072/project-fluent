import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProgressService } from '../progress/progress.service';
import {
  EngagementStatus,
  ProgressOutcome,
  SessionState,
  type Session,
  type SessionCompositionPart,
  type SessionCompositionPartName,
} from '../../generated/prisma/client';
import type { SessionCompositionPartResponse } from '../session-generation/session.types';

type InProgressSession = Session & { compositionParts: SessionCompositionPart[] };

/**
 * Realizes M18's Session Experience Service: tracking a Learner's
 * engagement with a Session through to Completed or Abandoned. Reads and
 * writes Session data directly through Persistence (M31's dependency
 * table lists Persistence and Progress as this module's only
 * dependencies) — it never depends on the Session Generation Module.
 */
@Injectable()
export class SessionExperienceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly progressService: ProgressService,
  ) {}

  /** RecordCompositionPartEngagement (M18). */
  async recordCompositionPartEngagement(
    userId: string,
    sessionId: string,
    part: SessionCompositionPartName,
    status: typeof EngagementStatus.IN_PROGRESS | typeof EngagementStatus.REACHED_END,
  ): Promise<SessionCompositionPartResponse> {
    const session = await this.getInProgressSessionOrFail(userId, sessionId);

    const updated = await this.prisma.sessionCompositionPart.update({
      where: { sessionId_part: { sessionId: session.id, part } },
      data: { engagementStatus: status },
    });

    return {
      part: updated.part,
      content: updated.content,
      engagementStatus: updated.engagementStatus,
    };
  }

  /** CompleteSession (M18). */
  async completeSession(userId: string, sessionId: string): Promise<void> {
    const session = await this.getInProgressSessionOrFail(userId, sessionId);

    if (!this.allPartsReachedEnd(session)) {
      throw new ConflictException(
        'All seven Session Composition parts must have an Engagement Status of Reached End before completing this Session.',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.session.update({
        where: { id: session.id },
        data: { state: SessionState.COMPLETED },
      });
      await this.progressService.recordOutcome(session.id, ProgressOutcome.COMPLETED, tx);
    });
  }

  /** AbandonSession (M18). */
  async abandonSession(userId: string, sessionId: string): Promise<void> {
    const session = await this.getInProgressSessionOrFail(userId, sessionId);

    if (this.allPartsReachedEnd(session)) {
      throw new ConflictException(
        'This Session has all seven Session Composition parts Reached End — complete it instead of abandoning it.',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.session.update({
        where: { id: session.id },
        data: { state: SessionState.ABANDONED },
      });
      await this.progressService.recordOutcome(session.id, ProgressOutcome.INCOMPLETE, tx);
    });
  }

  private allPartsReachedEnd(session: InProgressSession): boolean {
    return session.compositionParts.every(
      (part) => part.engagementStatus === EngagementStatus.REACHED_END,
    );
  }

  private async getInProgressSessionOrFail(
    userId: string,
    sessionId: string,
  ): Promise<InProgressSession> {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId },
      include: { compositionParts: true },
    });
    if (!session) {
      throw new NotFoundException('No Session exists with this id for this account.');
    }
    if (session.state !== SessionState.IN_PROGRESS) {
      throw new ConflictException('This Session is not In Progress.');
    }
    return session;
  }
}
