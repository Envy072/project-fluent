import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { IsIn, IsNotEmpty, IsOptional, IsString, validateSync } from 'class-validator';

/**
 * Realizes M38's "Environment Validation" Deployment Lifecycle stage at the
 * application level: the process refuses to start rather than boot into a
 * silently misconfigured state. This is deliberately independent of any
 * specific secret store (AWS Secrets Manager, SSM, GitHub Actions secrets,
 * a plain .env file) — the application only ever reads process.env; where
 * those values physically come from is an infrastructure concern outside
 * this module's responsibility, per M20's layering.
 */
export class EnvironmentVariables {
  @IsIn(['development', 'test', 'production'])
  NODE_ENV!: 'development' | 'test' | 'production';

  /**
   * Distinct from NODE_ENV on purpose: NODE_ENV=production is Next.js/Node's
   * own runtime-optimization switch, and is set inside the Docker image
   * even for local rehearsal of the production build (docker-compose runs
   * the real production artifact locally, with dev-only secrets, purely to
   * verify it works — a completely normal thing to do, not a real
   * deployment). DEPLOYMENT_ENVIRONMENT is the actual signal for "is this a
   * real production deployment," and is what gates the placeholder-secret
   * rejection below — conflating the two would make it impossible to
   * rehearse the production build locally at all.
   */
  @IsIn(['local', 'ci', 'staging', 'production'])
  DEPLOYMENT_ENVIRONMENT!: 'local' | 'ci' | 'staging' | 'production';

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  AUTH_JWT_SECRET!: string;

  @IsOptional()
  @IsString()
  AUTH_JWT_EXPIRES_IN?: string;

  @IsString()
  @IsNotEmpty()
  ANTHROPIC_API_KEY!: string;

  @IsOptional()
  @IsString()
  ANTHROPIC_MODEL?: string;

  @IsOptional()
  @IsString()
  WEB_APP_URL?: string;

  @IsOptional()
  @IsString()
  PORT?: string;
}

/**
 * Substrings that only ever appear in the placeholder secrets committed to
 * .env.example, docker-compose.yml, and ci.yml for local/CI use (see
 * ADR-related conventions established since Sprint 2). A real production
 * environment carrying one of these markers indicates a real secret was
 * never actually configured — refusing to start is safer than running
 * with a known-shared, publicly-visible value.
 */
const DEV_ONLY_SECRET_MARKERS = [
  'dev-only',
  'ci-only',
  'local-dev',
  'placeholder',
  'do-not-use-in-production',
];

const SECRET_FIELD_NAMES = ['AUTH_JWT_SECRET', 'ANTHROPIC_API_KEY'] as const;

export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  const withDefaults = { NODE_ENV: 'development', DEPLOYMENT_ENVIRONMENT: 'local', ...config };
  const validated = plainToInstance(EnvironmentVariables, withDefaults, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    const messages = errors.flatMap((error) => Object.values(error.constraints ?? {}));
    throw new Error(`Invalid environment configuration:\n${messages.join('\n')}`);
  }

  if (validated.DEPLOYMENT_ENVIRONMENT === 'production') {
    rejectDevOnlySecrets(validated);
  }

  return validated;
}

function rejectDevOnlySecrets(config: EnvironmentVariables): void {
  for (const fieldName of SECRET_FIELD_NAMES) {
    const value = config[fieldName].toLowerCase();
    const matchedMarker = DEV_ONLY_SECRET_MARKERS.find((marker) => value.includes(marker));
    if (matchedMarker) {
      throw new Error(
        `${fieldName} looks like a development/CI placeholder (contains "${matchedMarker}") ` +
          `but DEPLOYMENT_ENVIRONMENT=production. Refusing to start with a non-production secret.`,
      );
    }
  }
}
