import { Module } from '@nestjs/common';
import { LearningConfigurationModule } from '../learning-configuration/learning-configuration.module';
import { AiIntegrationModule } from '../ai-integration/ai-integration.module';
import { ProgressModule } from '../progress/progress.module';
import { SessionGenerationController } from './session-generation.controller';
import { SessionGenerationService } from './session-generation.service';

@Module({
  imports: [LearningConfigurationModule, AiIntegrationModule, ProgressModule],
  controllers: [SessionGenerationController],
  providers: [SessionGenerationService],
})
export class SessionGenerationModule {}
