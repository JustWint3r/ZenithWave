# Quick Start Guide - Get Your Bot Running in 5 Minutes

## Prerequisites Check

Make sure you have:
- [x] Node.js 18+ installed
- [x] MongoDB installed (or MongoDB Atlas account)
- [x] FFmpeg installed
- [x] Discord account

## 5-Minute Setup

### Step 1: Create Discord Bot (2 minutes)

1. Visit https://discord.com/developers/applications
2. Click "New Application" → Name it → "Create"
3. Go to "Bot" tab → "Reset Token" → Copy the token
4. Enable under "Privileged Gateway Intents":
   - ✅ SERVER MEMBERS INTENT
   - ✅ MESSAGE CONTENT INTENT
5. Go to "OAuth2" → "URL Generator"
   - Scopes: `bot`, `applications.commands`
   - Permissions: `Send Messages`, `Embed Links`, `Connect`, `Speak`, `Read Messages/View Channels`
6. Copy URL and invite bot to your server

### Step 2: Configure Bot (1 minute)

```bash
cd /home/wint3r/Desktop/DiscBot

chmod +x install.sh
./install.sh

cp .env.example .env
nano .env
```

Edit `.env`:
```env
DISCORD_TOKEN=paste_your_token_here
CLIENT_ID=your_application_id
GUILD_ID=your_server_id
MONGODB_URI=mongodb://localhost:27017/discordbot
```

**Getting IDs:**
- CLIENT_ID: Discord Developer Portal → Your App → General Information → Application ID
- GUILD_ID: Discord → Enable Developer Mode → Right-click your server → Copy ID

### Step 3: Install Dependencies (1 minute)

```bash
npm install
```

### Step 4: Deploy Commands (30 seconds)

```bash
npm run deploy
```

You should see:
```
Successfully reloaded X guild commands.
```

### Step 5: Start Bot (30 seconds)

```bash
npm start
```

You should see:
```
Connected to MongoDB
Logged in as YourBot#1234
Bot is ready!
```

## Verify It Works

1. **Test Leveling:**
   - Send a few messages in your Discord server
   - Type `/rank` - you should see your level

2. **Test Music:**
   - Join a voice channel
   - Type `/play never gonna give you up`
   - Music should start playing

## If Something Goes Wrong

### Bot doesn't start:
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Or start it
sudo systemctl start mongod
```

### Commands don't appear:
```bash
# Re-deploy commands
npm run deploy

# Wait 1-2 minutes and restart Discord
```

### Music doesn't play:
```bash
# Verify FFmpeg
ffmpeg -version

# If not installed (Ubuntu/Debian):
sudo apt install ffmpeg

# If not installed (macOS):
brew install ffmpeg
```

## Production Deployment

### Option 1: Keep it Running with PM2

```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option 2: Docker

```bash
docker-compose up -d
```

## What's Next?

- Read [COMMANDS.md](COMMANDS.md) for all available commands
- Check [README.md](README.md) for detailed documentation
- Review [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for production deployment

## Quick Commands Reference

### Leveling
- `/rank` - Your rank and level
- `/leaderboard` - Top users

### Music
- `/play <song>` - Play music
- `/pause` - Pause
- `/skip` - Skip
- `/queue` - View queue
- `/stop` - Stop music

## Support

If you run into issues:
1. Check the error message in terminal
2. Review troubleshooting in [README.md](README.md)
3. Verify all prerequisites are installed
4. Check logs: `pm2 logs` (if using PM2)

## File Structure Reference

```
DiscBot/
├── src/
│   ├── commands/        # All bot commands
│   ├── events/          # Event handlers
│   ├── models/          # Database models
│   └── utils/           # Helper functions
├── config/              # Configuration
├── .env                 # Your secrets (DON'T COMMIT!)
└── package.json         # Dependencies
```

---

**Need more help?** Read the full guides:
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
- [README.md](README.md) - Complete documentation
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Technical overview
