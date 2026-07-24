#!/usr/bin/env bash
# Realizes M38's "Environment Validation" Deployment Lifecycle stage at the
# pipeline level: confirms every secret the deployment target will need is
# actually configured before Execution begins, per M38's Deployment
# Readiness ("no unresolved... violation exists"). This checks presence
# only — the application's own startup validation (M38's stage realized
# at the process level) confirms the values themselves are well-formed and
# not a leftover development/CI placeholder.
set -euo pipefail

REQUIRED_VARS=(
  DATABASE_URL
  AUTH_JWT_SECRET
  ANTHROPIC_API_KEY
  NEXTAUTH_SECRET
  NEXTAUTH_URL
  API_URL
)

missing=()
for var_name in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var_name:-}" ]; then
    missing+=("$var_name")
  fi
done

if [ ${#missing[@]} -gt 0 ]; then
  echo "Environment Validation failed — missing required variable(s): ${missing[*]}" >&2
  exit 1
fi

echo "Environment Validation passed — all required variables are present."
