import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './config/environment-variables';
import { HealthModule } from './health/health.module';
import { ObservabilityModule } from './observability/observability.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LearningConfigurationModule } from './learning-configuration/learning-configuration.module';
import { AiIntegrationModule } from './ai-integration/ai-integration.module';
import { ProgressModule } from './progress/progress.module';
import { SessionGenerationModule } from './session-generation/session-generation.module';
import { SessionExperienceModule } from './session-experience/session-experience.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: validateEnvironment,
    }),
    PrismaModule,
    ObservabilityModule,
    HealthModule,
    UsersModule,
    AuthModule,
    LearningConfigurationModule,
    AiIntegrationModule,
    ProgressModule,
    SessionGenerationModule,
    SessionExperienceModule,
  ],
})
export class AppModule {}
