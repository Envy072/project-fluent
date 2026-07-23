import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { SessionGenerationService } from './session-generation.service';
import type { SessionResponse } from './session.types';

@UseGuards(JwtAuthGuard)
@Controller('sessions')
export class SessionGenerationController {
  constructor(private readonly sessionGenerationService: SessionGenerationService) {}

  /** GenerateSession (M18). */
  @Post()
  @HttpCode(201)
  generate(@CurrentUser() user: AuthenticatedUser): Promise<SessionResponse> {
    return this.sessionGenerationService.generateSession(user.id);
  }
}
