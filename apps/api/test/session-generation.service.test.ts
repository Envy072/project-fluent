import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConflictException } from '@nestjs/common';
import { SessionGenerationService } from '../src/session-generation/session-generation.service';
import type { LearningConfigurationService } from '../src/learning-configuration/learning-configuration.service';
import type { AiIntegrationService } from '../src/ai-integration/ai-integration.service';
import type { ProgressService } from '../src/progress/progress.service';
import type { PrismaService } from '../src/prisma/prisma.service';
import type { ObservabilityService } from '../src/observability/observability.service';
import {
  EnglishLevel,
  LearningGoal,
  SessionCompositionPartName,
  SessionState,
  TopicAssignmentScope,
} from '../generated/prisma/client';

const now = new Date('2026-01-01T00:00:00.000Z');

const CONFIGURATION = {
  id: 'config-1',
  englishLevel: EnglishLevel.B1,
  learningGoal: LearningGoal.IELTS,
  useOneTopicForAllSkills: true,
  createdAt: now,
  updatedAt: now,
};

const GENERATED_TOPICS = [{ subjectMatter: 'Coffee culture', assignmentScope: 'session' as const }];

const GENERATED_COMPOSITION = {
  reading: 'Reading content',
  listening: 'Listening content',
  speaking: 'Speaking content',
  writing: 'Writing content',
  vocabulary: 'Vocabulary content',
  grammar: 'Grammar content',
  quiz: 'Quiz content',
};

function buildPrismaMock() {
  const tx = {
    session: { create: vi.fn() },
    topic: { createMany: vi.fn() },
    sessionCompositionPart: { createMany: vi.fn() },
  };
  const prisma = {
    session: { findFirst: vi.fn() },
    $transaction: vi.fn((callback: (transactionClient: typeof tx) => unknown) => callback(tx)),
  };
  return { prisma: prisma as unknown as PrismaService, tx };
}

function buildLearningConfigurationServiceMock() {
  return { findByUserId: vi.fn() } as unknown as LearningConfigurationService;
}

function buildAiIntegrationServiceMock() {
  return {
    generateTopics: vi.fn().mockResolvedValue(GENERATED_TOPICS),
    generateCompositionContent: vi.fn().mockResolvedValue(GENERATED_COMPOSITION),
  } as unknown as AiIntegrationService;
}

function buildProgressServiceMock() {
  return { createProgressRecord: vi.fn() } as unknown as ProgressService;
}

function buildObservabilityServiceMock() {
  return { logEvent: vi.fn() } as unknown as ObservabilityService;
}

describe('SessionGenerationService', () => {
  let prisma: ReturnType<typeof buildPrismaMock>['prisma'];
  let tx: ReturnType<typeof buildPrismaMock>['tx'];
  let learningConfigurationService: ReturnType<typeof buildLearningConfigurationServiceMock>;
  let aiIntegrationService: ReturnType<typeof buildAiIntegrationServiceMock>;
  let progressService: ReturnType<typeof buildProgressServiceMock>;
  let observability: ReturnType<typeof buildObservabilityServiceMock>;
  let service: SessionGenerationService;

  beforeEach(() => {
    ({ prisma, tx } = buildPrismaMock());
    learningConfigurationService = buildLearningConfigurationServiceMock();
    aiIntegrationService = buildAiIntegrationServiceMock();
    progressService = buildProgressServiceMock();
    observability = buildObservabilityServiceMock();
    service = new SessionGenerationService(
      prisma,
      learningConfigurationService,
      aiIntegrationService,
      progressService,
      observability,
    );
  });

  it('generates a complete Session from the current Learning Configuration', async () => {
    vi.mocked(learningConfigurationService.findByUserId).mockResolvedValue(CONFIGURATION);
    vi.mocked(prisma.session.findFirst)
      .mockResolvedValueOnce(null) // no existing In Progress session
      .mockResolvedValueOnce({
        id: 'session-1',
        state: SessionState.IN_PROGRESS,
        englishLevel: EnglishLevel.B1,
        learningGoal: LearningGoal.IELTS,
        useOneTopicForAllSkills: true,
        createdAt: now,
        updatedAt: now,
        topics: [
          { subjectMatter: 'Coffee culture', assignmentScope: TopicAssignmentScope.SESSION },
        ],
        compositionParts: [
          {
            part: SessionCompositionPartName.READING,
            content: 'Reading content',
            engagementStatus: 'NOT_STARTED',
          },
        ],
      } as never);
    vi.mocked(tx.session.create).mockResolvedValue({ id: 'session-1' } as never);

    const result = await service.generateSession('user-1');

    expect(aiIntegrationService.generateTopics).toHaveBeenCalledWith({
      englishLevel: EnglishLevel.B1,
      learningGoal: LearningGoal.IELTS,
      topicToggleEnabled: true,
    });
    expect(aiIntegrationService.generateCompositionContent).toHaveBeenCalledWith({
      englishLevel: EnglishLevel.B1,
      learningGoal: LearningGoal.IELTS,
      topics: GENERATED_TOPICS,
    });
    expect(tx.session.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        englishLevel: EnglishLevel.B1,
        learningGoal: LearningGoal.IELTS,
        useOneTopicForAllSkills: true,
        state: SessionState.IN_PROGRESS,
      },
    });
    expect(tx.topic.createMany).toHaveBeenCalledWith({
      data: [
        {
          sessionId: 'session-1',
          subjectMatter: 'Coffee culture',
          assignmentScope: TopicAssignmentScope.SESSION,
        },
      ],
    });
    const compositionCall = vi.mocked(tx.sessionCompositionPart.createMany).mock.calls[0]![0] as {
      data: { part: string }[];
    };
    expect(compositionCall.data).toHaveLength(7);
    expect(progressService.createProgressRecord).toHaveBeenCalledWith('session-1', tx);
    expect(result.id).toBe('session-1');
    expect(result.compositionParts).toHaveLength(1);
    expect(observability.logEvent).toHaveBeenCalledWith(
      'session.generation.succeeded',
      'business_flows',
      {
        userId: 'user-1',
        sessionId: 'session-1',
        englishLevel: EnglishLevel.B1,
        learningGoal: LearningGoal.IELTS,
      },
    );
  });

  it('rejects generation when no Learning Configuration exists', async () => {
    vi.mocked(learningConfigurationService.findByUserId).mockRejectedValue(new Error('not found'));

    await expect(service.generateSession('user-1')).rejects.toBeInstanceOf(ConflictException);
    expect(aiIntegrationService.generateTopics).not.toHaveBeenCalled();
    expect(observability.logEvent).toHaveBeenCalledWith(
      'session.generation.failed',
      'business_flows',
      { userId: 'user-1', reason: 'configuration_unconfigured' },
    );
  });

  it('rejects generation when another Session is already In Progress', async () => {
    vi.mocked(learningConfigurationService.findByUserId).mockResolvedValue(CONFIGURATION);
    vi.mocked(prisma.session.findFirst).mockResolvedValueOnce({ id: 'existing-session' } as never);

    await expect(service.generateSession('user-1')).rejects.toBeInstanceOf(ConflictException);
    expect(aiIntegrationService.generateTopics).not.toHaveBeenCalled();
    expect(observability.logEvent).toHaveBeenCalledWith(
      'session.generation.failed',
      'business_flows',
      { userId: 'user-1', reason: 'session_already_in_progress' },
    );
  });

  it('rejects generation when AI generation fails', async () => {
    vi.mocked(learningConfigurationService.findByUserId).mockResolvedValue(CONFIGURATION);
    vi.mocked(prisma.session.findFirst).mockResolvedValueOnce(null);
    vi.mocked(aiIntegrationService.generateTopics).mockRejectedValue(new Error('AI unavailable'));

    await expect(service.generateSession('user-1')).rejects.toThrow('AI unavailable');
    expect(observability.logEvent).toHaveBeenCalledWith(
      'session.generation.failed',
      'business_flows',
      { userId: 'user-1', reason: 'ai_generation_failed' },
    );
  });

  it('maps a Disabled Topic Toggle Preference to one Topic per part', async () => {
    vi.mocked(learningConfigurationService.findByUserId).mockResolvedValue({
      ...CONFIGURATION,
      useOneTopicForAllSkills: false,
    });
    vi.mocked(prisma.session.findFirst)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: 'session-1',
        state: SessionState.IN_PROGRESS,
        englishLevel: EnglishLevel.B1,
        learningGoal: LearningGoal.IELTS,
        useOneTopicForAllSkills: false,
        createdAt: now,
        updatedAt: now,
        topics: [],
        compositionParts: [],
      } as never);
    vi.mocked(tx.session.create).mockResolvedValue({ id: 'session-1' } as never);
    vi.mocked(aiIntegrationService.generateTopics).mockResolvedValue([
      { subjectMatter: 'Topic A', assignmentScope: 'reading' },
      { subjectMatter: 'Topic B', assignmentScope: 'listening' },
    ]);

    await service.generateSession('user-1');

    expect(tx.topic.createMany).toHaveBeenCalledWith({
      data: [
        {
          sessionId: 'session-1',
          subjectMatter: 'Topic A',
          assignmentScope: TopicAssignmentScope.READING,
        },
        {
          sessionId: 'session-1',
          subjectMatter: 'Topic B',
          assignmentScope: TopicAssignmentScope.LISTENING,
        },
      ],
    });
  });
});
