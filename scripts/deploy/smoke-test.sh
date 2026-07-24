#!/usr/bin/env bash
# Realizes M38's "Deployment Verification" stage: confirms the deployed
# system actually behaves as documented before the deployment is
# considered complete. This is intentionally minimal (M38 defines no
# specific verification mechanism) — it checks that the two services are
# reachable and healthy, not every documented behavior; the existing e2e
# suite already covers full User Flow verification pre-deployment.
set -euo pipefail

API_BASE_URL="${1:-${API_BASE_URL:-http://localhost:4000}}"
WEB_BASE_URL="${2:-${WEB_BASE_URL:-http://localhost:3100}}"
MAX_ATTEMPTS=10
SLEEP_SECONDS=3

check_url() {
  local name="$1"
  local url="$2"
  local attempt=1
  local http_status

  while [ "$attempt" -le "$MAX_ATTEMPTS" ]; do
    # curl already prints "000" via -w on a connection failure; `|| true`
    # only suppresses curl's own non-zero exit (so `set -e` doesn't abort
    # the whole script) without appending a second, duplicate value.
    http_status="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$url" || true)"
    if [ "$http_status" -ge 200 ] && [ "$http_status" -lt 400 ]; then
      echo "[$name] OK — $url responded $http_status (attempt $attempt/$MAX_ATTEMPTS)"
      return 0
    fi
    echo "[$name] not ready yet — $url responded $http_status (attempt $attempt/$MAX_ATTEMPTS)"
    attempt=$((attempt + 1))
    sleep "$SLEEP_SECONDS"
  done

  echo "[$name] FAILED — $url never responded successfully after $MAX_ATTEMPTS attempts" >&2
  return 1
}

check_url "api" "$API_BASE_URL/health"
check_url "web" "$WEB_BASE_URL/"

echo "Deployment Verification passed."
