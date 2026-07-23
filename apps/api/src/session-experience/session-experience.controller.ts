import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { SessionCompositionPartName } from '../../generated/prisma/client';
import type { SessionCompositionPartResponse } from '../session-generation/session.types';
import { RecordEngagementDto } from './dto/record-engagement.dto';
import { SessionExperienceService } from './session-experience.service';

@UseGuards(JwtAuthGuard)
@Controller('sessions/:id')
export class SessionExperienceController {
  constructor(private readonly sessionExperienceService: SessionExperienceService) {}

  /** RecordCompositionPartEngagement (M18). */
  @Patch('parts/:part/engagement')
  recordEngagement(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') sessionId: string,
    @Param('part', new ParseEnumPipe(SessionCompositionPartName)) part: SessionCompositionPartName,
    @Body() dto: RecordEngagementDto,
  ): Promise<SessionCompositionPartResponse> {
    return this.sessionExperienceService.recordCompositionPartEngagement(
      user.id,
      sessionId,
      part,
      dto.status,
    );
  }

  /** CompleteSession (M18). */
  @Post('complete')
  @HttpCode(204)
  complete(@CurrentUser() user: AuthenticatedUser, @Param('id') sessionId: string): Promise<void> {
    return this.sessionExperienceService.completeSession(user.id, sessionId);
  }

  /** AbandonSession (M18). */
  @Post('abandon')
  @HttpCode(204)
  abandon(@CurrentUser() user: AuthenticatedUser, @Param('id') sessionId: string): Promise<void> {
    return this.sessionExperienceService.abandonSession(user.id, sessionId);
  }
}
