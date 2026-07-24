import { describe, expect, it } from 'vitest';
import { validateWebEnvironment } from '../lib/environment-variables';

const VALID_BASE = {
  NEXTAUTH_SECRET: 'a-real-randomly-generated-secret',
  NEXTAUTH_URL: 'https://app.example.com',
  API_URL: 'https://api.example.com',
};

describe('validateWebEnvironment', () => {
  it('accepts a complete, valid development configuration', () => {
    expect(() => validateWebEnvironment({ ...VALID_BASE, NODE_ENV: 'development' })).not.toThrow();
  });

  it('rejects a missing required variable', () => {
    const { NEXTAUTH_URL: _omitted, ...withoutNextAuthUrl } = VALID_BASE;
    expect(() =>
      validateWebEnvironment({ ...withoutNextAuthUrl, NODE_ENV: 'development' }),
    ).toThrow(/Missing required environment variable/);
  });

  it('allows NODE_ENV=production locally (rehearsing the production build) with a placeholder secret', () => {
    expect(() =>
      validateWebEnvironment({
        ...VALID_BASE,
        NODE_ENV: 'production',
        DEPLOYMENT_ENVIRONMENT: 'local',
        NEXTAUTH_SECRET: 'dev-only-web-nextauth-secret-do-not-use-in-production',
      }),
    ).not.toThrow();
  });

  it('accepts a valid real-production configuration with a real-looking secret', () => {
    expect(() =>
      validateWebEnvironment({ ...VALID_BASE, DEPLOYMENT_ENVIRONMENT: 'production' }),
    ).not.toThrow();
  });

  it('rejects a dev-only placeholder NEXTAUTH_SECRET when DEPLOYMENT_ENVIRONMENT=production', () => {
    expect(() =>
      validateWebEnvironment({
        ...VALID_BASE,
        DEPLOYMENT_ENVIRONMENT: 'production',
        NEXTAUTH_SECRET: 'dev-only-web-nextauth-secret-do-not-use-in-production',
      }),
    ).toThrow(/NEXTAUTH_SECRET looks like a development\/CI placeholder/);
  });

  it('allows the same placeholder value in ci and unset deployment tiers', () => {
    expect(() =>
      validateWebEnvironment({
        ...VALID_BASE,
        DEPLOYMENT_ENVIRONMENT: 'ci',
        NEXTAUTH_SECRET: 'e2e-test-nextauth-secret-do-not-use-in-production',
      }),
    ).not.toThrow();
  });
});
