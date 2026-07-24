/**
 * Realizes M38's "Environment Validation" Deployment Lifecycle stage for
 * the frontend: the server refuses to start rather than boot into a
 * silently misconfigured state. Independent of any specific secret store —
 * this only ever reads process.env, regardless of how those values are
 * physically injected (a .env file locally, GitHub Actions secrets today,
 * Vercel/AWS secret management once a production account exists).
 */
const REQUIRED_VARS = ['NEXTAUTH_SECRET', 'NEXTAUTH_URL', 'API_URL'] as const;

/**
 * Substrings that only ever appear in the placeholder secrets committed to
 * .env.example, docker-compose.yml, ci.yml, and playwright.config.ts for
 * local/CI use. A real production environment carrying one of these
 * markers indicates a real secret was never actually configured.
 */
const DEV_ONLY_SECRET_MARKERS = [
  'dev-only',
  'ci-only',
  'e2e-test',
  'local-dev',
  'placeholder',
  'do-not-use-in-production',
];

export function validateWebEnvironment(env: Record<string, string | undefined>): void {
  const missing = REQUIRED_VARS.filter((name) => !env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
  }

  // Distinct from NODE_ENV on purpose: NODE_ENV=production is Next.js's own
  // runtime-optimization switch, set inside the Docker image even when
  // rehearsing the production build locally via docker-compose with
  // dev-only secrets — a normal thing to do, not a real deployment.
  // DEPLOYMENT_ENVIRONMENT is the actual "is this really production" signal.
  if (env.DEPLOYMENT_ENVIRONMENT !== 'production') {
    return;
  }

  const secretValue = env.NEXTAUTH_SECRET!.toLowerCase();
  const matchedMarker = DEV_ONLY_SECRET_MARKERS.find((marker) => secretValue.includes(marker));
  if (matchedMarker) {
    throw new Error(
      `NEXTAUTH_SECRET looks like a development/CI placeholder (contains "${matchedMarker}") ` +
        `but DEPLOYMENT_ENVIRONMENT=production. Refusing to start with a non-production secret.`,
    );
  }
}
