#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

echo "🚀 Deploying frontend container..."

# pull latest code
git fetch origin main
git reset --hard origin/main

# build .env.production
echo "NEXT_PUBLIC_API_BASE_URL=http://cp25nk2.sit.kmutt.ac.th:8000/" > .env.production

# rebuild and restart container
docker compose -f docker-compose.frontend.yml down
docker compose -f docker-compose.frontend.yml build --no-cache
docker compose -f docker-compose.frontend.yml up -d

echo "✅ Frontend deployed successfully!"
