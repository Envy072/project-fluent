import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Protected Route Infrastructure (per this sprint's scope): guards any
 * endpoint requiring a Signed In Authentication State, verifying the
 * bearer access token issued by AuthService.issueAccessToken.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
