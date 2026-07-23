import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { SessionExperienceService } from '../src/session-experience/session-experience.service';
import type { ProgressService } from '../src/progress/progress.service';
import type { PrismaService } from '../src/prisma/prisma.service';
import type { ObservabilityService } from '../src/observability/observability.service';
import {
  EngagementStatus,
  ProgressOutcome,
  SessionCompositionPartName,
  SessionState,
} from '../generated/prisma/client';

const now = new Date('2026-01-01T00:00:00.000Z');

function buildPart(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'part-1',
    sessionId: 'session-1',
    part: SessionCompositionPartName.READING,
    content: 'Reading content',
    engagementStatus: EngagementStatus.NOT_STARTED,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function buildSession(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'session-1',
    userId: 'user-1',
    state: SessionState.IN_PROGRESS,
    compositionParts: [buildPart()],
    ...overrides,
  };
}

function buildPrismaMock() {
  const tx = { session: { update: vi.fn() } };
  const prisma = {
    session: { findFirst: vi.fn() },
    sessionCompositionPart: { update: vi.fn() },
    $transaction: vi.fn((callback: (transactionClient: typeof tx) => unknown) => callback(tx)),
  };
  return { prisma: prisma as unknown as PrismaService, tx };
}

function buildProgressServiceMock() {
  return { recordOutcome: vi.fn() } as unknown as ProgressService;
}

function buildObservabilityServiceMock() {
  return { logEvent: vi.fn() } as unknown as ObservabilityService;
}

describe('SessionExperienceService', () => {
  let prisma: ReturnType<typeof buildPrismaMock>['prisma'];
  let tx: ReturnType<typeof buildPrismaMock>['tx'];
  let progressService: ReturnType<typeof buildProgressServiceMock>;
  let observability: ReturnType<typeof buildObservabilityServiceMock>;
  let service: SessionExperienceService;

  beforeEach(() => {
    ({ prisma, tx } = buildPrismaMock());
    progressService = buildProgressServiceMock();
    observability = buildObservabilityServiceMock();
    service = new SessionExperienceService(prisma, progressService, observability);
  });

  describe('recordCompositionPartEngagement', () => {
    it('records the given status for the specified part', async () => {
      vi.mocked(prisma.session.findFirst).mockResolvedValue(buildSession() as never);
      vi.mocked(prisma.sessionCompositionPart.update).mockResolvedValue(
        buildPart({ engagementStatus: EngagementStatus.REACHED_END }) as never,
      );

      const result = await service.recordCompositionPartEngagement(
        'user-1',
        'session-1',
        SessionCompositionPartName.READING,
        EngagementStatus.REACHED_END,
      );

      expect(prisma.sessionCompositionPart.update).toHaveBeenCalledWith({
        where: {
          sessionId_part: { sessionId: 'session-1', part: SessionCompositionPartName.READING },
        },
        data: { engagementStatus: EngagementStatus.REACHED_END },
      });
      expect(result.engagementStatus).toBe(EngagementStatus.REACHED_END);
    });

    it('throws NotFoundException when the Session does not belong to the caller', async () => {
      vi.mocked(prisma.session.findFirst).mockResolvedValue(null);

      await expect(
        service.recordCompositionPartEngagement(
          'user-1',
          'session-1',
          SessionCompositionPartName.READING,
          EngagementStatus.REACHED_END,
        ),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws ConflictException when the Session is not In Progress', async () => {
      vi.mocked(prisma.session.findFirst).mockResolvedValue(
        buildSession({ state: SessionState.COMPLETED }) as never,
      );

      await expect(
        service.recordCompositionPartEngagement(
          'user-1',
          'session-1',
          SessionCompositionPartName.READING,
          EngagementStatus.REACHED_END,
        ),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('completeSession', () => {
    it('completes the Session and records a Completed outcome when all parts Reached End', async () => {
      vi.mocked(prisma.session.findFirst).mockResolvedValue(
        buildSession({
          compositionParts: [buildPart({ engagementStatus: EngagementStatus.REACHED_END })],
        }) as never,
      );

      await service.completeSession('user-1', 'session-1');

      expect(tx.session.update).toHaveBeenCalledWith({
        where: { id: 'session-1' },
        data: { state: SessionState.COMPLETED },
      });
      expect(progressService.recordOutcome).toHaveBeenCalledWith(
        'session-1',
        ProgressOutcome.COMPLETED,
        tx,
      );
      expect(observability.logEvent).toHaveBeenCalledWith('session.completed', 'business_flows', {
        userId: 'user-1',
        sessionId: 'session-1',
      });
    });

    it('rejects when not all parts have Reached End', async () => {
      vi.mocked(prisma.session.findFirst).mockResolvedValue(
        buildSession({
          compositionParts: [buildPart({ engagementStatus: EngagementStatus.IN_PROGRESS })],
        }) as never,
      );

      await expect(service.completeSession('user-1', 'session-1')).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(tx.session.update).not.toHaveBeenCalled();
    });
  });

  describe('abandonSession', () => {
    it('abandons the Session and records an Incomplete outcome when not all parts Reached End', async () => {
      vi.mocked(prisma.session.findFirst).mockResolvedValue(
        buildSession({
          compositionParts: [buildPart({ engagementStatus: EngagementStatus.IN_PROGRESS })],
        }) as never,
      );

      await service.abandonSession('user-1', 'session-1');

      expect(tx.session.update).toHaveBeenCalledWith({
        where: { id: 'session-1' },
        data: { state: SessionState.ABANDONED },
      });
      expect(progressService.recordOutcome).toHaveBeenCalledWith(
        'session-1',
        ProgressOutcome.INCOMPLETE,
        tx,
      );
      expect(observability.logEvent).toHaveBeenCalledWith('session.abandoned', 'business_flows', {
        userId: 'user-1',
        sessionId: 'session-1',
      });
    });

    it('rejects when all seven parts have already Reached End', async () => {
      vi.mocked(prisma.session.findFirst).mockResolvedValue(
        buildSession({
          compositionParts: [buildPart({ engagementStatus: EngagementStatus.REACHED_END })],
        }) as never,
      );

      await expect(service.abandonSession('user-1', 'session-1')).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(tx.session.update).not.toHaveBeenCalled();
    });
  });
});
