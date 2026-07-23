import { Module } from '@nestjs/common';
import { LearningConfigurationController } from './learning-configuration.controller';
import { LearningConfigurationService } from './learning-configuration.service';

@Module({
  controllers: [LearningConfigurationController],
  providers: [LearningConfigurationService],
  exports: [LearningConfigurationService],
})
export class LearningConfigurationModule {}
