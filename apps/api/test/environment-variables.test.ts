import { describe, expect, it } from 'vitest';
import { validateEnvironment } from '../src/config/environment-variables';

const VALID_BASE = {
  DATABASE_URL: 'postgresql://user:pass@host:5432/db',
  AUTH_JWT_SECRET: 'a-real-randomly-generated-secret',
  ANTHROPIC_API_KEY: 'sk-ant-a-real-key',
};

describe('validateEnvironment', () => {
  it('accepts a complete, valid development configuration', () => {
    const result = validateEnvironment({ ...VALID_BASE, NODE_ENV: 'development' });
    expect(result.NODE_ENV).toBe('development');
    expect(result.DATABASE_URL).toBe(VALID_BASE.DATABASE_URL);
  });

  it('defaults NODE_ENV to development and DEPLOYMENT_ENVIRONMENT to local when unset', () => {
    const result = validateEnvironment({ ...VALID_BASE });
    expect(result.NODE_ENV).toBe('development');
    expect(result.DEPLOYMENT_ENVIRONMENT).toBe('local');
  });

  it('allows NODE_ENV=production locally (rehearsing the production build) with placeholder secrets', () => {
    const result = validateEnvironment({
      ...VALID_BASE,
      NODE_ENV: 'production',
      DEPLOYMENT_ENVIRONMENT: 'local',
      AUTH_JWT_SECRET: 'dev-only-web-nextauth-secret-do-not-use-in-production',
    });
    expect(result.NODE_ENV).toBe('production');
    expect(result.DEPLOYMENT_ENVIRONMENT).toBe('local');
  });

  it('accepts a valid real-production configuration with real-looking secrets', () => {
    const result = validateEnvironment({
      ...VALID_BASE,
      NODE_ENV: 'production',
      DEPLOYMENT_ENVIRONMENT: 'production',
    });
    expect(result.DEPLOYMENT_ENVIRONMENT).toBe('production');
  });

  it('rejects a missing required variable', () => {
    const { DATABASE_URL: _omitted, ...withoutDatabaseUrl } = VALID_BASE;
    expect(() => validateEnvironment({ ...withoutDatabaseUrl, NODE_ENV: 'development' })).toThrow(
      /Invalid environment configuration/,
    );
  });

  it('rejects an invalid NODE_ENV value', () => {
    expect(() => validateEnvironment({ ...VALID_BASE, NODE_ENV: 'staging' })).toThrow(
      /Invalid environment configuration/,
    );
  });

  it('rejects an invalid DEPLOYMENT_ENVIRONMENT value', () => {
    expect(() =>
      validateEnvironment({ ...VALID_BASE, DEPLOYMENT_ENVIRONMENT: 'not-a-real-tier' }),
    ).toThrow(/Invalid environment configuration/);
  });

  it('rejects a dev-only placeholder AUTH_JWT_SECRET when DEPLOYMENT_ENVIRONMENT=production', () => {
    expect(() =>
      validateEnvironment({
        ...VALID_BASE,
        DEPLOYMENT_ENVIRONMENT: 'production',
        AUTH_JWT_SECRET: 'dev-only-api-jwt-secret-do-not-use-in-production',
      }),
    ).toThrow(/AUTH_JWT_SECRET looks like a development\/CI placeholder/);
  });

  it('rejects a placeholder ANTHROPIC_API_KEY when DEPLOYMENT_ENVIRONMENT=production', () => {
    expect(() =>
      validateEnvironment({
        ...VALID_BASE,
        DEPLOYMENT_ENVIRONMENT: 'production',
        ANTHROPIC_API_KEY: 'local-dev-placeholder-not-a-real-anthropic-key',
      }),
    ).toThrow(/ANTHROPIC_API_KEY looks like a development\/CI placeholder/);
  });

  it('allows the same placeholder values in ci and staging tiers', () => {
    const ciResult = validateEnvironment({
      ...VALID_BASE,
      DEPLOYMENT_ENVIRONMENT: 'ci',
      AUTH_JWT_SECRET: 'ci-only-api-jwt-secret-do-not-use-in-production',
    });
    expect(ciResult.DEPLOYMENT_ENVIRONMENT).toBe('ci');

    const stagingResult = validateEnvironment({
      ...VALID_BASE,
      DEPLOYMENT_ENVIRONMENT: 'staging',
      AUTH_JWT_SECRET: 'dev-only-api-jwt-secret-do-not-use-in-production',
    });
    expect(stagingResult.DEPLOYMENT_ENVIRONMENT).toBe('staging');
  });
});
