#!/bin/bash

echo "🧹 Cleaning and reinstalling Hyperledger Fabric Explorer..."
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Clean everything
echo "🧹 Cleaning up..."
rm -rf node_modules package-lock.json

# Clear npm cache
echo "🗑️  Clearing npm cache..."
npm cache clean --force

# Install dependencies with legacy peer deps
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Force resolutions
echo "🔧 Applying dependency resolutions..."
npx npm-force-resolutions

# Reinstall with resolutions
echo "🔄 Reinstalling with resolutions..."
npm install --legacy-peer-deps

echo "✅ Clean installation completed!"
echo ""
echo "🎯 Next steps:"
echo "1. Run: npm run build"
echo "2. Run: npm start"
echo ""
echo "📝 All framer-motion references have been removed and replaced with CSS animations." 