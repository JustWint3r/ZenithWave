#!/bin/bash

echo "======================================"
echo "Discord Bot Installation Script"
echo "======================================"
echo ""

check_command() {
    if command -v $1 &> /dev/null; then
        echo "✓ $1 is installed"
        return 0
    else
        echo "✗ $1 is NOT installed"
        return 1
    fi
}

echo "Checking prerequisites..."
echo ""

check_command node
NODE_INSTALLED=$?

check_command npm
NPM_INSTALLED=$?

check_command mongod
MONGO_INSTALLED=$?

check_command ffmpeg
FFMPEG_INSTALLED=$?

echo ""

if [ $NODE_INSTALLED -ne 0 ] || [ $NPM_INSTALLED -ne 0 ]; then
    echo "ERROR: Node.js and npm are required!"
    echo "Install from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ $NODE_VERSION -lt 18 ]; then
    echo "ERROR: Node.js version 18 or higher is required!"
    echo "Current version: $(node -v)"
    exit 1
fi

if [ $MONGO_INSTALLED -ne 0 ]; then
    echo "WARNING: MongoDB is not installed!"
    echo "Install from: https://www.mongodb.com/try/download/community"
    echo "Or use MongoDB Atlas cloud database"
fi

if [ $FFMPEG_INSTALLED -ne 0 ]; then
    echo "WARNING: FFmpeg is not installed!"
    echo "Music playback will not work without FFmpeg"
    echo "Install from: https://ffmpeg.org/download.html"
fi

echo ""
echo "======================================"
echo "Installing npm dependencies..."
echo "======================================"
echo ""

npm install

if [ $? -ne 0 ]; then
    echo "ERROR: npm install failed!"
    exit 1
fi

echo ""
echo "======================================"
echo "Setting up environment file..."
echo "======================================"
echo ""

if [ -f .env ]; then
    echo ".env file already exists. Skipping..."
else
    cp .env.example .env
    echo "✓ Created .env file from .env.example"
    echo ""
    echo "IMPORTANT: Edit the .env file with your Discord bot token and other settings!"
    echo "Run: nano .env"
fi

echo ""
echo "======================================"
echo "Installation Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your Discord bot token"
echo "   nano .env"
echo ""
echo "2. Deploy slash commands to Discord"
echo "   npm run deploy"
echo ""
echo "3. Start the bot"
echo "   npm start"
echo ""
echo "For more information, see:"
echo "- README.md for full documentation"
echo "- SETUP_GUIDE.md for step-by-step setup"
echo "- COMMANDS.md for command reference"
echo ""
