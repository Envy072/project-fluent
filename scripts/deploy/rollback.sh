#!/usr/bin/env bash
# Realizes M37's Rollback Principles and M38's Recovery Principles:
# restores the last known Release-Ready state by redeploying a previous,
# already-verified image tag, then re-running Deployment Verification.
# Works identically against the rehearsal target today and a real
# ECS/Vercel target later — only the underlying deploy mechanism this
# script invokes changes; the rollback procedure itself does not.
set -euo pipefail

TARGET_TAG="${1:?Usage: rollback.sh <previous-image-tag>}"
REGISTRY="${IMAGE_REGISTRY:?IMAGE_REGISTRY must be set (e.g. ghcr.io/OWNER/REPO)}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

export API_IMAGE="${REGISTRY}/api:${TARGET_TAG}"
export WEB_IMAGE="${REGISTRY}/web:${TARGET_TAG}"

echo "Rolling back to ${TARGET_TAG}..."
echo "  API image: ${API_IMAGE}"
echo "  Web image: ${WEB_IMAGE}"

docker compose -f "$REPO_ROOT/docker-compose.deploy-rehearsal.yml" pull
docker compose -f "$REPO_ROOT/docker-compose.deploy-rehearsal.yml" up -d

echo "Rollback deployment started — running Deployment Verification..."
bash "$SCRIPT_DIR/smoke-test.sh"

echo "Rollback to ${TARGET_TAG} completed and verified."
