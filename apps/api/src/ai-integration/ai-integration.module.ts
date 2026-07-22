import { Module } from '@nestjs/common';
import { anthropicClientProvider } from './anthropic-client.provider';
import { AiIntegrationService } from './ai-integration.service';

/**
 * No controller exists in this module — per M21, the AI Layer is invoked
 * exclusively by the Session Generation Module (M31), never directly
 * reachable by any other subsystem, and Version 1 defines no HTTP surface
 * for it.
 */
@Module({
  providers: [anthropicClientProvider, AiIntegrationService],
  exports: [AiIntegrationService],
})
export class AiIntegrationModule {}
