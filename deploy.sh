#!/bin/bash
set -e

echo "========================================"
echo "🎓 STARTING EIT COUNSELLING DEPLOYMENT"
echo "========================================"

# ───────────────── PULL LATEST CODE ─────────────────
echo ""
echo "📥 Pulling latest code..."
echo ""
cd /home/eit-ipuniversity
git pull origin main

# ───────────────── DEPENDENCIES ─────────────────
echo ""
echo "📦 Installing dependencies..."
echo ""
npm install

# ───────────────── BUILD ─────────────────
echo ""
echo "🏗️  Building production bundle..."
echo ""
npm run build

# ───────────────── PM2 ─────────────────
echo ""
echo "♻️  Restarting app..."
echo ""
pm2 restart eit-ipuniversity

# ───────────────── NGINX ─────────────────
echo ""
echo "🌐 Testing nginx..."
echo ""
sudo nginx -t

echo ""
echo "♻️  Restarting nginx..."
echo ""
sudo systemctl restart nginx

echo ""
echo "========================================"
echo "✅ EIT COUNSELLING DEPLOYED SUCCESSFULLY"
echo "========================================"
