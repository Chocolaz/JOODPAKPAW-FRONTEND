#!/usr/bin/env bash
set -e

# โหลด nvm เพื่อให้ PATH ของ node/npm ถูกต้อง
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd "$(dirname "$0")"

echo "🚀 Starting deploy..."

# อัปเดต code
git fetch origin main
git reset --hard origin/main


# ติดตั้ง dependencies
npm ci

# เตรียม env
cp .env.production .env.local

# สร้าง build
npm run build

# เริ่มหรือรีสตาร์ท pm2
if pm2 list | grep -q "next-app"; then
  pm2 restart next-app
else
  pm2 start npm --name "next-app" -- run start
fi

pm2 save
echo "✅ Deploy finished at $(date)"
