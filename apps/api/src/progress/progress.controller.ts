import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { ProgressService } from './progress.service';
import type { MostRecentOutcomeResponse } from './progress.types';

@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  /** GetMostRecentOutcome (M18). */
  @Get('latest')
  getLatest(@CurrentUser() user: AuthenticatedUser): Promise<MostRecentOutcomeResponse> {
    return this.progressService.getMostRecentOutcome(user.id);
  }
}
