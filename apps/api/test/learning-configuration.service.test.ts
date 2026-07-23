import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { LearningConfigurationService } from '../src/learning-configuration/learning-configuration.service';
import type { PrismaService } from '../src/prisma/prisma.service';
import type { ObservabilityService } from '../src/observability/observability.service';
import { EnglishLevel, LearningGoal } from '../generated/prisma/client';

const now = new Date('2026-01-01T00:00:00.000Z');

function buildConfig(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'config-1',
    userId: 'user-1',
    englishLevel: EnglishLevel.B1,
    learningGoal: LearningGoal.IELTS,
    useOneTopicForAllSkills: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function buildPrismaMock() {
  return {
    learningConfiguration: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  } as unknown as PrismaService;
}

function buildObservabilityServiceMock() {
  return { logEvent: vi.fn() } as unknown as ObservabilityService;
}

describe('LearningConfigurationService', () => {
  let prisma: ReturnType<typeof buildPrismaMock>;
  let observability: ReturnType<typeof buildObservabilityServiceMock>;
  let service: LearningConfigurationService;

  beforeEach(() => {
    prisma = buildPrismaMock();
    observability = buildObservabilityServiceMock();
    service = new LearningConfigurationService(prisma, observability);
  });

  describe('create', () => {
    it('creates a configuration when none exists yet, defaulting the topic toggle to true', async () => {
      vi.mocked(prisma.learningConfiguration.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.learningConfiguration.create).mockResolvedValue(buildConfig());

      const result = await service.create('user-1', {
        englishLevel: EnglishLevel.B1,
        learningGoal: LearningGoal.IELTS,
      });

      expect(prisma.learningConfiguration.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          englishLevel: EnglishLevel.B1,
          learningGoal: LearningGoal.IELTS,
          useOneTopicForAllSkills: true,
        },
      });
      expect(result).toMatchObject({
        englishLevel: EnglishLevel.B1,
        learningGoal: LearningGoal.IELTS,
      });
      expect(observability.logEvent).toHaveBeenCalledWith(
        'configuration.changed',
        'business_flows',
        {
          userId: 'user-1',
          action: 'created',
          englishLevel: EnglishLevel.B1,
          learningGoal: LearningGoal.IELTS,
          useOneTopicForAllSkills: true,
        },
      );
    });

    it('honors an explicit topic toggle value', async () => {
      vi.mocked(prisma.learningConfiguration.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.learningConfiguration.create).mockResolvedValue(
        buildConfig({ useOneTopicForAllSkills: false }),
      );

      await service.create('user-1', {
        englishLevel: EnglishLevel.B1,
        learningGoal: LearningGoal.IELTS,
        useOneTopicForAllSkills: false,
      });

      expect(prisma.learningConfiguration.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          englishLevel: EnglishLevel.B1,
          learningGoal: LearningGoal.IELTS,
          useOneTopicForAllSkills: false,
        },
      });
    });

    it('rejects creation when a configuration already exists for the user', async () => {
      vi.mocked(prisma.learningConfiguration.findUnique).mockResolvedValue(buildConfig());

      await expect(
        service.create('user-1', {
          englishLevel: EnglishLevel.B1,
          learningGoal: LearningGoal.IELTS,
        }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.learningConfiguration.create).not.toHaveBeenCalled();
    });
  });

  describe('findByUserId', () => {
    it('returns the configuration belonging to the user', async () => {
      vi.mocked(prisma.learningConfiguration.findUnique).mockResolvedValue(buildConfig());

      const result = await service.findByUserId('user-1');

      expect(prisma.learningConfiguration.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
      expect(result.id).toBe('config-1');
    });

    it('throws NotFoundException when no configuration exists', async () => {
      vi.mocked(prisma.learningConfiguration.findUnique).mockResolvedValue(null);

      await expect(service.findByUserId('user-1')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates only the fields provided', async () => {
      vi.mocked(prisma.learningConfiguration.findUnique).mockResolvedValue(buildConfig());
      vi.mocked(prisma.learningConfiguration.update).mockResolvedValue(
        buildConfig({ englishLevel: EnglishLevel.C1 }),
      );

      const result = await service.update('user-1', { englishLevel: EnglishLevel.C1 });

      expect(prisma.learningConfiguration.update).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        data: { englishLevel: EnglishLevel.C1 },
      });
      expect(result.englishLevel).toBe(EnglishLevel.C1);
    });

    it('throws NotFoundException when no configuration exists to update', async () => {
      vi.mocked(prisma.learningConfiguration.findUnique).mockResolvedValue(null);

      await expect(
        service.update('user-1', { englishLevel: EnglishLevel.C1 }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.learningConfiguration.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes the configuration when it exists', async () => {
      vi.mocked(prisma.learningConfiguration.findUnique).mockResolvedValue(buildConfig());
      vi.mocked(prisma.learningConfiguration.delete).mockResolvedValue(buildConfig());

      await service.remove('user-1');

      expect(prisma.learningConfiguration.delete).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
      expect(observability.logEvent).toHaveBeenCalledWith(
        'configuration.changed',
        'business_flows',
        {
          userId: 'user-1',
          action: 'deleted',
        },
      );
    });

    it('throws NotFoundException when no configuration exists to delete', async () => {
      vi.mocked(prisma.learningConfiguration.findUnique).mockResolvedValue(null);

      await expect(service.remove('user-1')).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.learningConfiguration.delete).not.toHaveBeenCalled();
    });
  });
});
