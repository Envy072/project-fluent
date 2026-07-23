import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ObservabilityService } from '../observability/observability.service';
import { BusinessEvent, ObservabilityDomain } from '../observability/observability.types';
import type { LearningConfiguration } from '../../generated/prisma/client';
import type { CreateLearningConfigurationDto } from './dto/create-learning-configuration.dto';
import type { UpdateLearningConfigurationDto } from './dto/update-learning-configuration.dto';
import type { LearningConfigurationResponse } from './learning-configuration.types';

/**
 * Realizes M09's Learning Configuration domain: exactly one current English
 * Level, Learning Goal, and Topic Toggle Preference per Learner. Every
 * operation is scoped to the caller's own userId (never a client-supplied
 * id), so ownership isolation is structural rather than a defensive check.
 */
@Injectable()
export class LearningConfigurationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly observability: ObservabilityService,
  ) {}

  async create(
    userId: string,
    dto: CreateLearningConfigurationDto,
  ): Promise<LearningConfigurationResponse> {
    const existing = await this.prisma.learningConfiguration.findUnique({ where: { userId } });
    if (existing) {
      throw new ConflictException('A learning configuration already exists for this account.');
    }

    const config = await this.prisma.learningConfiguration.create({
      data: {
        userId,
        englishLevel: dto.englishLevel,
        learningGoal: dto.learningGoal,
        useOneTopicForAllSkills: dto.useOneTopicForAllSkills ?? true,
      },
    });
    this.logConfigurationChanged(userId, 'created', config);
    return this.toResponse(config);
  }

  async findByUserId(userId: string): Promise<LearningConfigurationResponse> {
    const config = await this.prisma.learningConfiguration.findUnique({ where: { userId } });
    if (!config) {
      throw new NotFoundException('No learning configuration exists for this account yet.');
    }
    return this.toResponse(config);
  }

  async update(
    userId: string,
    dto: UpdateLearningConfigurationDto,
  ): Promise<LearningConfigurationResponse> {
    await this.findByUserId(userId);

    const config = await this.prisma.learningConfiguration.update({
      where: { userId },
      data: {
        ...(dto.englishLevel !== undefined && { englishLevel: dto.englishLevel }),
        ...(dto.learningGoal !== undefined && { learningGoal: dto.learningGoal }),
        ...(dto.useOneTopicForAllSkills !== undefined && {
          useOneTopicForAllSkills: dto.useOneTopicForAllSkills,
        }),
      },
    });
    this.logConfigurationChanged(userId, 'updated', config);
    return this.toResponse(config);
  }

  async remove(userId: string): Promise<void> {
    await this.findByUserId(userId);
    await this.prisma.learningConfiguration.delete({ where: { userId } });
    this.observability.logEvent(
      BusinessEvent.CONFIGURATION_CHANGED,
      ObservabilityDomain.BUSINESS_FLOWS,
      { userId, action: 'deleted' },
    );
  }

  private logConfigurationChanged(
    userId: string,
    action: 'created' | 'updated',
    config: LearningConfiguration,
  ): void {
    this.observability.logEvent(
      BusinessEvent.CONFIGURATION_CHANGED,
      ObservabilityDomain.BUSINESS_FLOWS,
      {
        userId,
        action,
        englishLevel: config.englishLevel,
        learningGoal: config.learningGoal,
        useOneTopicForAllSkills: config.useOneTopicForAllSkills,
      },
    );
  }

  private toResponse(config: LearningConfiguration): LearningConfigurationResponse {
    return {
      id: config.id,
      englishLevel: config.englishLevel,
      learningGoal: config.learningGoal,
      useOneTopicForAllSkills: config.useOneTopicForAllSkills,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    };
  }
}
