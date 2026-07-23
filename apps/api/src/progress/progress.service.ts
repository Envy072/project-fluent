import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ObservabilityService } from '../observability/observability.service';
import { BusinessEvent, ObservabilityDomain } from '../observability/observability.types';
import { ProgressOutcome, type Prisma } from '../../generated/prisma/client';
import type { MostRecentOutcomeResponse } from './progress.types';

type PrismaClientOrTransaction = PrismaService | Prisma.TransactionClient;

/**
 * Realizes M18's Progress Service: establishing a Pending Progress Record
 * when a Session begins, finalizing its outcome when the Session ends, and
 * exposing the Learner's most recent outcome for Dashboard reflection.
 */
@Injectable()
export class ProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly observability: ObservabilityService,
  ) {}

  /**
   * CreateProgressRecord (M18). Accepts an optional transaction client so
   * callers that must create a Session and its Progress Record atomically
   * (Session Generation) can run this within their own transaction.
   */
  async createProgressRecord(
    sessionId: string,
    client: PrismaClientOrTransaction = this.prisma,
  ): Promise<void> {
    const existing = await client.progressRecord.findUnique({ where: { sessionId } });
    if (existing) {
      throw new ConflictException('A Progress Record already exists for this Session.');
    }

    await client.progressRecord.create({
      data: { sessionId, outcome: ProgressOutcome.PENDING },
    });
  }

  /**
   * RecordOutcome (M18). Accepts an optional transaction client so callers
   * that must finalize a Session's state and its Progress Record
   * atomically (Session Experience) can run this within their own
   * transaction.
   */
  async recordOutcome(
    sessionId: string,
    outcome: typeof ProgressOutcome.COMPLETED | typeof ProgressOutcome.INCOMPLETE,
    client: PrismaClientOrTransaction = this.prisma,
  ): Promise<void> {
    const existing = await client.progressRecord.findUnique({ where: { sessionId } });
    if (!existing || existing.outcome !== ProgressOutcome.PENDING) {
      throw new ConflictException('No Pending Progress Record exists for this Session.');
    }

    await client.progressRecord.update({
      where: { sessionId },
      data: { outcome },
    });

    this.observability.logEvent(
      BusinessEvent.PROGRESS_RECORDED,
      ObservabilityDomain.BUSINESS_FLOWS,
      {
        sessionId,
        outcome,
      },
    );
  }

  /** GetMostRecentOutcome (M18). */
  async getMostRecentOutcome(userId: string): Promise<MostRecentOutcomeResponse> {
    const record = await this.prisma.progressRecord.findFirst({
      where: { session: { userId } },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      return { hasGeneratedSession: false };
    }

    return { hasGeneratedSession: true, sessionId: record.sessionId, outcome: record.outcome };
  }
}
