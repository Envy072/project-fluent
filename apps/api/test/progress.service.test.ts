import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConflictException } from '@nestjs/common';
import { ProgressService } from '../src/progress/progress.service';
import type { PrismaService } from '../src/prisma/prisma.service';
import { ProgressOutcome } from '../generated/prisma/client';

function buildPrismaMock() {
  return {
    progressRecord: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findFirst: vi.fn(),
    },
  } as unknown as PrismaService;
}

describe('ProgressService', () => {
  let prisma: ReturnType<typeof buildPrismaMock>;
  let service: ProgressService;

  beforeEach(() => {
    prisma = buildPrismaMock();
    service = new ProgressService(prisma);
  });

  describe('createProgressRecord', () => {
    it('creates a Pending Progress Record when none exists for the Session', async () => {
      vi.mocked(prisma.progressRecord.findUnique).mockResolvedValue(null);

      await service.createProgressRecord('session-1');

      expect(prisma.progressRecord.create).toHaveBeenCalledWith({
        data: { sessionId: 'session-1', outcome: ProgressOutcome.PENDING },
      });
    });

    it('rejects when a Progress Record already exists for the Session', async () => {
      vi.mocked(prisma.progressRecord.findUnique).mockResolvedValue({
        id: 'record-1',
        sessionId: 'session-1',
        outcome: ProgressOutcome.PENDING,
      } as never);

      await expect(service.createProgressRecord('session-1')).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(prisma.progressRecord.create).not.toHaveBeenCalled();
    });
  });

  describe('recordOutcome', () => {
    it('finalizes a Pending Progress Record with the given outcome', async () => {
      vi.mocked(prisma.progressRecord.findUnique).mockResolvedValue({
        id: 'record-1',
        sessionId: 'session-1',
        outcome: ProgressOutcome.PENDING,
      } as never);

      await service.recordOutcome('session-1', ProgressOutcome.COMPLETED);

      expect(prisma.progressRecord.update).toHaveBeenCalledWith({
        where: { sessionId: 'session-1' },
        data: { outcome: ProgressOutcome.COMPLETED },
      });
    });

    it('rejects when no Pending Progress Record exists for the Session', async () => {
      vi.mocked(prisma.progressRecord.findUnique).mockResolvedValue(null);

      await expect(
        service.recordOutcome('session-1', ProgressOutcome.COMPLETED),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.progressRecord.update).not.toHaveBeenCalled();
    });

    it('rejects when the Progress Record has already been Recorded', async () => {
      vi.mocked(prisma.progressRecord.findUnique).mockResolvedValue({
        id: 'record-1',
        sessionId: 'session-1',
        outcome: ProgressOutcome.COMPLETED,
      } as never);

      await expect(
        service.recordOutcome('session-1', ProgressOutcome.INCOMPLETE),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.progressRecord.update).not.toHaveBeenCalled();
    });
  });

  describe('getMostRecentOutcome', () => {
    it('indicates no Session has ever been generated', async () => {
      vi.mocked(prisma.progressRecord.findFirst).mockResolvedValue(null);

      const result = await service.getMostRecentOutcome('user-1');

      expect(result).toEqual({ hasGeneratedSession: false });
    });

    it('returns the most recent Progress Record outcome', async () => {
      vi.mocked(prisma.progressRecord.findFirst).mockResolvedValue({
        id: 'record-1',
        sessionId: 'session-1',
        outcome: ProgressOutcome.COMPLETED,
      } as never);

      const result = await service.getMostRecentOutcome('user-1');

      expect(result).toEqual({
        hasGeneratedSession: true,
        sessionId: 'session-1',
        outcome: ProgressOutcome.COMPLETED,
      });
      expect(prisma.progressRecord.findFirst).toHaveBeenCalledWith({
        where: { session: { userId: 'user-1' } },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
