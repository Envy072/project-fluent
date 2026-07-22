import { Body, Controller, Delete, Get, HttpCode, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateLearningConfigurationDto } from './dto/create-learning-configuration.dto';
import { UpdateLearningConfigurationDto } from './dto/update-learning-configuration.dto';
import { LearningConfigurationService } from './learning-configuration.service';
import type { LearningConfigurationResponse } from './learning-configuration.types';

/**
 * Learning Configuration domain (M09): a single resource per authenticated
 * Learner, addressed by the caller's own identity rather than a URL id —
 * no admin functionality, no cross-user access is representable.
 */
@UseGuards(JwtAuthGuard)
@Controller('learning-configuration')
export class LearningConfigurationController {
  constructor(private readonly learningConfigurationService: LearningConfigurationService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateLearningConfigurationDto,
  ): Promise<LearningConfigurationResponse> {
    return this.learningConfigurationService.create(user.id, dto);
  }

  @Get()
  findMine(@CurrentUser() user: AuthenticatedUser): Promise<LearningConfigurationResponse> {
    return this.learningConfigurationService.findByUserId(user.id);
  }

  @Patch()
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateLearningConfigurationDto,
  ): Promise<LearningConfigurationResponse> {
    return this.learningConfigurationService.update(user.id, dto);
  }

  @Delete()
  @HttpCode(204)
  remove(@CurrentUser() user: AuthenticatedUser): Promise<void> {
    return this.learningConfigurationService.remove(user.id);
  }
}
