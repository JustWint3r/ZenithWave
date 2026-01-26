# Quick Setup Guide

This guide will help you get your Discord bot up and running in under 10 minutes.

## Step 1: Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name and click "Create"
4. Go to "Bot" section in the left sidebar
5. Click "Reset Token" and copy the token (save it somewhere safe)
6. Enable these toggles under "Privileged Gateway Intents":
   - ✅ SERVER MEMBERS INTENT
   - ✅ MESSAGE CONTENT INTENT
7. Click "Save Changes"

## Step 2: Invite Bot to Server

1. Go to "OAuth2" > "URL Generator" in the left sidebar
2. Select these scopes:
   - ✅ bot
   - ✅ applications.commands
3. Select these bot permissions:
   - ✅ Read Messages/View Channels
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Connect
   - ✅ Speak
   - ✅ Use Voice Activity
4. Copy the generated URL at the bottom
5. Open the URL in your browser and invite the bot to your server

## Step 3: Install Dependencies

### On Windows

1. Install [Node.js](https://nodejs.org/) (version 18 or higher)
2. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
3. Install [FFmpeg](https://ffmpeg.org/download.html):
   - Download from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/)
   - Extract and add to PATH

### On macOS

```bash
brew install node mongodb-community ffmpeg
brew services start mongodb-community
```

### On Linux (Ubuntu/Debian)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org ffmpeg

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Step 4: Configure Bot

1. Open terminal in the bot directory
2. Install npm packages:

```bash
npm install
```

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Edit `.env` file with your information:

```env
DISCORD_TOKEN=your_bot_token_from_step_1
CLIENT_ID=your_client_id
GUILD_ID=your_server_id
MONGODB_URI=mongodb://localhost:27017/discordbot
```

**How to get these values:**
- `DISCORD_TOKEN`: From Step 1, the bot token you copied
- `CLIENT_ID`: Go to "General Information" in Developer Portal, copy "Application ID"
- `GUILD_ID`: Enable Developer Mode in Discord (Settings > Advanced > Developer Mode), then right-click your server and "Copy ID"

## Step 5: Deploy Commands

```bash
npm run deploy
```

You should see output like:
```
Loaded command: rank
Loaded command: leaderboard
Loaded command: play
...
Successfully reloaded X guild commands.
```

## Step 6: Start Bot

```bash
npm start
```

You should see:
```
Logged in as YourBot#1234
Bot is in 1 guilds
Serving X users
Bot is ready!
```

## Step 7: Test the Bot

In your Discord server, try these commands:

1. Send some messages to earn XP
2. Type `/rank` to see your level
3. Join a voice channel
4. Type `/play never gonna give you up` to play music

## Troubleshooting

### "Cannot find module" error
```bash
rm -rf node_modules package-lock.json
npm install
```

### Bot doesn't respond to commands
1. Run `npm run deploy` again
2. Make sure bot has permissions in your server
3. Check the bot is online in your server member list

### "MongoServerError: connect ECONNREFUSED"
- Make sure MongoDB is running
- On Windows: Check Services for "MongoDB Server"
- On macOS: `brew services start mongodb-community`
- On Linux: `sudo systemctl start mongod`

### Music doesn't play
1. Make sure FFmpeg is installed: run `ffmpeg -version`
2. Ensure bot has "Connect" and "Speak" permissions
3. Make sure you're in a voice channel

### Bot goes offline after closing terminal
Use PM2 for production:
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
```

## Next Steps

- Read [README.md](README.md) for full documentation
- Learn about deployment options
- Customize XP rates in `.env`
- Add more commands

## Getting Help

- Check [README.md](README.md) for detailed documentation
- Review the [Discord.js Guide](https://discordjs.guide/)
- Check MongoDB is running: `mongosh` or `mongo`

## Security Reminder

- ⚠️ Never share your bot token
- ⚠️ Never commit `.env` file to Git
- ⚠️ Regenerate token if accidentally exposed
