#!/bin/bash

# ioWidgets Quick Start Script
# This script checks prerequisites and starts the application

echo "🚀 ioWidgets Quick Start"
echo "======================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo ""
    echo "Please install Node.js first:"
    echo ""
    echo "macOS:"
    echo "  brew install node"
    echo ""
    echo "Or download from:"
    echo "  https://nodejs.org/"
    echo ""
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version is $NODE_VERSION, but 18+ is recommended"
    echo ""
fi

echo "✅ Node.js $(node -v) detected"
echo "✅ npm $(npm -v) detected"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    echo "This may take a few minutes..."
    echo ""
    npm install
    
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ Installation failed"
        echo "Please check the error messages above"
        exit 1
    fi
    
    echo ""
    echo "✅ Dependencies installed successfully!"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

echo "🎉 Starting ioWidgets..."
echo ""
echo "The app will open at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "======================="
echo ""

# Start the development server
npm run dev
