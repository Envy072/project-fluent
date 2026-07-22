import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LearningConfigurationModule } from './learning-configuration/learning-configuration.module';
import { AiIntegrationModule } from './ai-integration/ai-integration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    HealthModule,
    UsersModule,
    AuthModule,
    LearningConfigurationModule,
    AiIntegrationModule,
  ],
})
export class AppModule {}
