import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { ObservabilityService } from '../observability/observability.service';
import { BusinessEvent, ObservabilityDomain } from '../observability/observability.types';
import type { AuthenticatedUser, JwtPayload, PublicUser } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly observability: ObservabilityService,
  ) {}

  /**
   * Realizes the Identity & Access Service's CreateAccount operation (M18):
   * establishes a new, distinct Learner Identity from an email and password.
   */
  async register(email: string, password: string): Promise<PublicUser> {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      this.observability.logEvent(
        BusinessEvent.AUTH_REGISTER_FAILED,
        ObservabilityDomain.BUSINESS_FLOWS,
        {
          reason: 'email_already_registered',
        },
      );
      throw new ConflictException('An account with this email already exists.');
    }

    const passwordHash = await argon2.hash(password);
    const user = await this.usersService.create(email, passwordHash);
    this.observability.logEvent(
      BusinessEvent.AUTH_REGISTER_SUCCEEDED,
      ObservabilityDomain.BUSINESS_FLOWS,
      {
        userId: user.id,
      },
    );
    return this.toPublicUser(user);
  }

  /**
   * Realizes the Identity & Access Service's SignIn credential verification
   * (M18): confirms the provided credentials match an existing account.
   * Returns null rather than throwing, so callers can respond uniformly
   * regardless of whether the email or the password was wrong.
   */
  async validateCredentials(email: string, password: string): Promise<PublicUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const passwordMatches = await argon2.verify(user.passwordHash, password);
    if (!passwordMatches) {
      return null;
    }

    return this.toPublicUser(user);
  }

  async validateCredentialsOrThrow(email: string, password: string): Promise<PublicUser> {
    const user = await this.validateCredentials(email, password);
    if (!user) {
      this.observability.logEvent(
        BusinessEvent.AUTH_LOGIN_FAILED,
        ObservabilityDomain.BUSINESS_FLOWS,
        {
          reason: 'invalid_credentials',
        },
      );
      throw new UnauthorizedException('Invalid email or password.');
    }
    this.observability.logEvent(
      BusinessEvent.AUTH_LOGIN_SUCCEEDED,
      ObservabilityDomain.BUSINESS_FLOWS,
      {
        userId: user.id,
      },
    );
    return user;
  }

  issueAccessToken(user: AuthenticatedUser): string {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  private toPublicUser(user: { id: string; email: string; createdAt: Date }): PublicUser {
    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }
}
