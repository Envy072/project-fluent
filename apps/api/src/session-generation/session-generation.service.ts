import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LearningConfigurationService } from '../learning-configuration/learning-configuration.service';
import { AiIntegrationService } from '../ai-integration/ai-integration.service';
import { ProgressService } from '../progress/progress.service';
import { ObservabilityService } from '../observability/observability.service';
import { BusinessEvent, ObservabilityDomain } from '../observability/observability.types';
import {
  SessionState,
  TopicAssignmentScope,
  type SessionCompositionPartName,
} from '../../generated/prisma/client';
import type {
  GeneratedSessionComposition,
  GeneratedTopic,
  SessionCompositionPart as AiSessionCompositionPart,
} from '../ai-integration/ai-integration.types';
import type {
  SessionCompositionPartResponse,
  SessionResponse,
  TopicResponse,
} from './session.types';

const AI_PART_TO_PRISMA_PART: Record<AiSessionCompositionPart, SessionCompositionPartName> = {
  reading: 'READING',
  listening: 'LISTENING',
  speaking: 'SPEAKING',
  writing: 'WRITING',
  vocabulary: 'VOCABULARY',
  grammar: 'GRAMMAR',
  quiz: 'QUIZ',
};

/**
 * Realizes M18's Session Generation Service: GenerateSession, producing one
 * complete Session from the Learner's current Learning Configuration via
 * the AI Integration Module (M21), per M08's Session Generation Logic.
 */
@Injectable()
export class SessionGenerationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly learningConfigurationService: LearningConfigurationService,
    private readonly aiIntegrationService: AiIntegrationService,
    private readonly progressService: ProgressService,
    private readonly observability: ObservabilityService,
  ) {}

  async generateSession(userId: string): Promise<SessionResponse> {
    const configuration = await this.getConfigurationOrFail(userId);

    const existingInProgress = await this.prisma.session.findFirst({
      where: { userId, state: SessionState.IN_PROGRESS },
    });
    if (existingInProgress) {
      this.logGenerationFailed(userId, 'session_already_in_progress');
      throw new ConflictException(
        'Another Session is already In Progress for this account. Complete or abandon it before generating a new one.',
      );
    }

    let topics: GeneratedTopic[];
    let compositionContent: GeneratedSessionComposition;
    try {
      topics = await this.aiIntegrationService.generateTopics({
        englishLevel: configuration.englishLevel,
        learningGoal: configuration.learningGoal,
        topicToggleEnabled: configuration.useOneTopicForAllSkills,
      });

      compositionContent = await this.aiIntegrationService.generateCompositionContent({
        englishLevel: configuration.englishLevel,
        learningGoal: configuration.learningGoal,
        topics,
      });
    } catch (error) {
      this.logGenerationFailed(userId, 'ai_generation_failed');
      throw error;
    }

    const session = await this.prisma.$transaction(async (tx) => {
      const createdSession = await tx.session.create({
        data: {
          userId,
          englishLevel: configuration.englishLevel,
          learningGoal: configuration.learningGoal,
          useOneTopicForAllSkills: configuration.useOneTopicForAllSkills,
          state: SessionState.IN_PROGRESS,
        },
      });

      await tx.topic.createMany({
        data: topics.map((topic) => ({
          sessionId: createdSession.id,
          subjectMatter: topic.subjectMatter,
          assignmentScope: this.toPrismaAssignmentScope(topic),
        })),
      });

      await tx.sessionCompositionPart.createMany({
        data: (Object.keys(compositionContent) as AiSessionCompositionPart[]).map((part) => ({
          sessionId: createdSession.id,
          part: AI_PART_TO_PRISMA_PART[part],
          content: compositionContent[part],
        })),
      });

      await this.progressService.createProgressRecord(createdSession.id, tx);

      return createdSession;
    });

    this.observability.logEvent(
      BusinessEvent.SESSION_GENERATION_SUCCEEDED,
      ObservabilityDomain.BUSINESS_FLOWS,
      {
        userId,
        sessionId: session.id,
        englishLevel: configuration.englishLevel,
        learningGoal: configuration.learningGoal,
      },
    );

    return this.loadGeneratedSession(session.id, userId);
  }

  private logGenerationFailed(
    userId: string,
    reason: 'configuration_unconfigured' | 'session_already_in_progress' | 'ai_generation_failed',
  ): void {
    this.observability.logEvent(
      BusinessEvent.SESSION_GENERATION_FAILED,
      ObservabilityDomain.BUSINESS_FLOWS,
      { userId, reason },
    );
  }

  /**
   * Internal only — reassembles the just-created Session with its Topics
   * and Composition parts for GenerateSession's own response. Not a
   * general-purpose "read a Session" operation: M18 defines no such
   * operation for the Session Generation Service, and per M31's
   * dependency table, Session Experience (a peer module) reads Session
   * data through its own Persistence access, never through this service.
   */
  private async loadGeneratedSession(sessionId: string, userId: string): Promise<SessionResponse> {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId },
      include: { topics: true, compositionParts: true },
    });
    if (!session) {
      throw new NotFoundException('No Session exists with this id for this account.');
    }

    return this.toResponse(session);
  }

  private async getConfigurationOrFail(userId: string) {
    try {
      return await this.learningConfigurationService.findByUserId(userId);
    } catch {
      this.logGenerationFailed(userId, 'configuration_unconfigured');
      throw new ConflictException(
        'English Level and Learning Goal must both be Configured before a Session can be generated.',
      );
    }
  }

  private toPrismaAssignmentScope(topic: GeneratedTopic): TopicAssignmentScope {
    if (topic.assignmentScope === 'session') {
      return TopicAssignmentScope.SESSION;
    }
    return AI_PART_TO_PRISMA_PART[topic.assignmentScope];
  }

  private toResponse(session: {
    id: string;
    state: SessionState;
    englishLevel: SessionResponse['englishLevel'];
    learningGoal: SessionResponse['learningGoal'];
    useOneTopicForAllSkills: boolean;
    createdAt: Date;
    updatedAt: Date;
    topics: { subjectMatter: string; assignmentScope: TopicAssignmentScope }[];
    compositionParts: SessionCompositionPartResponse[];
  }): SessionResponse {
    const topics: TopicResponse[] = session.topics.map((topic) => ({
      subjectMatter: topic.subjectMatter,
      assignmentScope: topic.assignmentScope,
    }));

    return {
      id: session.id,
      state: session.state,
      englishLevel: session.englishLevel,
      learningGoal: session.learningGoal,
      useOneTopicForAllSkills: session.useOneTopicForAllSkills,
      topics,
      compositionParts: session.compositionParts,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }
}
