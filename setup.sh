#!/bin/bash

echo "🚀 LexLink Development Setup Script"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the LexLink root directory"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "🔧 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and add your GEMINI_API_KEY"
fi

# Check for GEMINI_API_KEY
if grep -q "your_gemini_api_key_here" .env 2>/dev/null; then
    echo "⚠️  Warning: Please update GEMINI_API_KEY in .env file"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start development:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: npm run dev"
echo ""
echo "🌐 To deploy:"
echo "   1. Deploy backend to Railway"
echo "   2. Set VITE_BACKEND_URL in Vercel environment"
echo "   3. Deploy frontend to Vercel"
echo ""
echo "📖 See RAILWAY_DEPLOYMENT.md for detailed instructions"