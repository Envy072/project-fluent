import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import type { AuthenticatedUser, PublicUser } from './auth.types';

interface AuthResponse {
  user: PublicUser;
  accessToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Identity & Access Service: CreateAccount (M18). */
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    const user = await this.authService.register(dto.email, dto.password);
    const accessToken = this.authService.issueAccessToken(user);
    return { user, accessToken };
  }

  /**
   * Identity & Access Service: SignIn (M18). Invoked by Auth.js's Credentials
   * provider `authorize()` callback (per ADR-005) — this endpoint is the
   * authoritative credential verification, never Auth.js's own storage.
   */
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    const user = await this.authService.validateCredentialsOrThrow(dto.email, dto.password);
    const accessToken = this.authService.issueAccessToken(user);
    return { user, accessToken };
  }

  /**
   * Protected Route Infrastructure demonstration: returns the identity of
   * the Learner owning the presented access token (per M22's Access
   * Responsibilities — every protected operation confirms Authentication
   * State before proceeding).
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
