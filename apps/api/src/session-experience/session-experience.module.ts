import { Module } from '@nestjs/common';
import { ProgressModule } from '../progress/progress.module';
import { SessionExperienceController } from './session-experience.controller';
import { SessionExperienceService } from './session-experience.service';

@Module({
  imports: [ProgressModule],
  controllers: [SessionExperienceController],
  providers: [SessionExperienceService],
})
export class SessionExperienceModule {}
