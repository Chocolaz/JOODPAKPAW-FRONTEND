#!/usr/bin/env bash
# flow: frontend deploy script
set -e

cd "$(dirname "$0")"

echo "🚀 Deploying frontend container..."

# pull latest code
git fetch origin main
git reset --hard origin/main

# rebuild and restart container
docker compose -f docker-compose.yml down
docker compose -f docker-compose.yml build --no-cache
docker compose -f docker-compose.yml up -d
docker system prune -f

echo "✅ Frontend deployed successfully!"
