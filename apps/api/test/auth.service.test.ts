import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthService } from '../src/auth/auth.service';
import type { UsersService } from '../src/users/users.service';
import type { JwtService } from '@nestjs/jwt';
import type { ObservabilityService } from '../src/observability/observability.service';

const now = new Date('2026-01-01T00:00:00.000Z');

function buildUsersServiceMock() {
  return {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  } as unknown as UsersService;
}

function buildJwtServiceMock() {
  return {
    sign: vi.fn().mockReturnValue('signed.jwt.token'),
  } as unknown as JwtService;
}

function buildObservabilityServiceMock() {
  return { logEvent: vi.fn() } as unknown as ObservabilityService;
}

describe('AuthService', () => {
  let usersService: ReturnType<typeof buildUsersServiceMock>;
  let jwtService: ReturnType<typeof buildJwtServiceMock>;
  let observability: ReturnType<typeof buildObservabilityServiceMock>;
  let authService: AuthService;

  beforeEach(() => {
    usersService = buildUsersServiceMock();
    jwtService = buildJwtServiceMock();
    observability = buildObservabilityServiceMock();
    authService = new AuthService(usersService, jwtService, observability);
  });

  describe('register', () => {
    it('creates a new user with a hashed password when the email is unused', async () => {
      vi.mocked(usersService.findByEmail).mockResolvedValue(null);
      vi.mocked(usersService.create).mockImplementation(async (email, passwordHash) => ({
        id: 'user-1',
        email,
        passwordHash,
        createdAt: now,
        updatedAt: now,
      }));

      const result = await authService.register('learner@example.com', 'correct-horse-battery');

      expect(usersService.findByEmail).toHaveBeenCalledWith('learner@example.com');
      expect(usersService.create).toHaveBeenCalledTimes(1);
      const [, passwordHash] = vi.mocked(usersService.create).mock.calls[0]!;
      expect(passwordHash).not.toBe('correct-horse-battery');
      expect(await argon2.verify(passwordHash, 'correct-horse-battery')).toBe(true);

      expect(result).toEqual({ id: 'user-1', email: 'learner@example.com', createdAt: now });
      expect(result).not.toHaveProperty('passwordHash');
      expect(observability.logEvent).toHaveBeenCalledWith(
        'auth.register.succeeded',
        'business_flows',
        { userId: 'user-1' },
      );
    });

    it('rejects registration when the email already exists', async () => {
      vi.mocked(usersService.findByEmail).mockResolvedValue({
        id: 'existing-user',
        email: 'learner@example.com',
        passwordHash: 'irrelevant',
        createdAt: now,
        updatedAt: now,
      });

      await expect(
        authService.register('learner@example.com', 'correct-horse-battery'),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(usersService.create).not.toHaveBeenCalled();
      expect(observability.logEvent).toHaveBeenCalledWith(
        'auth.register.failed',
        'business_flows',
        { reason: 'email_already_registered' },
      );
    });
  });

  describe('validateCredentials', () => {
    it('returns the public user when the password matches', async () => {
      const passwordHash = await argon2.hash('correct-horse-battery');
      vi.mocked(usersService.findByEmail).mockResolvedValue({
        id: 'user-1',
        email: 'learner@example.com',
        passwordHash,
        createdAt: now,
        updatedAt: now,
      });

      const result = await authService.validateCredentials(
        'learner@example.com',
        'correct-horse-battery',
      );

      expect(result).toEqual({ id: 'user-1', email: 'learner@example.com', createdAt: now });
    });

    it('returns null when the password does not match', async () => {
      const passwordHash = await argon2.hash('correct-horse-battery');
      vi.mocked(usersService.findByEmail).mockResolvedValue({
        id: 'user-1',
        email: 'learner@example.com',
        passwordHash,
        createdAt: now,
        updatedAt: now,
      });

      const result = await authService.validateCredentials('learner@example.com', 'wrong-password');
      expect(result).toBeNull();
    });

    it('returns null when no account exists for the email', async () => {
      vi.mocked(usersService.findByEmail).mockResolvedValue(null);

      const result = await authService.validateCredentials('nobody@example.com', 'anything');
      expect(result).toBeNull();
    });
  });

  describe('validateCredentialsOrThrow', () => {
    it('throws UnauthorizedException when credentials are invalid', async () => {
      vi.mocked(usersService.findByEmail).mockResolvedValue(null);

      await expect(
        authService.validateCredentialsOrThrow('nobody@example.com', 'anything'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(observability.logEvent).toHaveBeenCalledWith('auth.login.failed', 'business_flows', {
        reason: 'invalid_credentials',
      });
    });

    it('logs a success event when credentials are valid', async () => {
      const passwordHash = await argon2.hash('correct-horse-battery');
      vi.mocked(usersService.findByEmail).mockResolvedValue({
        id: 'user-1',
        email: 'learner@example.com',
        passwordHash,
        createdAt: now,
        updatedAt: now,
      });

      await authService.validateCredentialsOrThrow('learner@example.com', 'correct-horse-battery');

      expect(observability.logEvent).toHaveBeenCalledWith(
        'auth.login.succeeded',
        'business_flows',
        { userId: 'user-1' },
      );
    });
  });

  describe('issueAccessToken', () => {
    it('signs a JWT payload containing the user id and email', () => {
      const token = authService.issueAccessToken({ id: 'user-1', email: 'learner@example.com' });

      expect(token).toBe('signed.jwt.token');
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: 'user-1', email: 'learner@example.com' });
    });
  });
});
