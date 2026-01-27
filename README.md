# ZenithWave Discord Music + LeadeBoard!

A feature-rich Discord bot built with discord.py 2.6.4 featuring music playback with queue system and XP-based leveling system.

## Features

### 🎵 Music System
- Multi-platform support (YouTube, Spotify, SoundCloud)
- Full queue management
- Auto-play next song from queue
- Multi-user queue support
- Real-time playback controls
- Volume control
- Now playing display with thumbnails
- Skip, pause, resume, and stop controls

### 📊 Leveling System
- XP tracking per message
- Automatic level-up notifications
- Per-guild user rankings
- Interactive leaderboard
- MongoDB persistence
- Configurable XP rates and cooldowns

### ✨ Other Features
- Slash commands (modern Discord UI)
- Per-guild data isolation
- Help command with all available commands
- Clean, organized cog-based architecture

## Prerequisites

- Python 3.10 or higher
- MongoDB 7.0 or higher
- FFmpeg (for music playback)
- Discord Bot Token with proper intents

## Installation

### 1. Clone the Repository

```bash
cd /home/wint3r/Desktop/DiscBot
```

### 2. Set Up Python Environment

```bash
cd python-bot

# Create virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configuration

Create a `.env` file in the `python-bot` directory:

```env
DISCORD_TOKEN=your_bot_token_here
MONGODB_URI=mongodb://localhost:27017/discordbot
```

#### Getting Discord Bot Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section
4. Click "Reset Token" to get your bot token
5. Enable these Privileged Gateway Intents:
   - **SERVER MEMBERS INTENT**
   - **MESSAGE CONTENT INTENT**
   - **PRESENCE INTENT** (optional)
6. Copy the token to your `.env` file

#### Bot Permissions

Your bot needs these permissions:
- Read Messages/View Channels
- Send Messages
- Embed Links
- Attach Files
- Connect (for voice)
- Speak (for voice)
- Use Slash Commands

**Permission Integer**: `277025508416` (or use Discord's permission calculator)

### 4. Start MongoDB

```bash
# Start MongoDB service
sudo systemctl start mongod

# Enable auto-start on boot (optional)
sudo systemctl enable mongod

# Verify it's running
sudo systemctl status mongod
```

### 5. Run the Bot

```bash
cd python-bot
python3 bot.py
```

The bot will automatically:
- Sync slash commands with Discord
- Connect to MongoDB
- Display ready status with guild and user count

## Commands

### 🎵 Music Commands

- `/play <query>` - Play a song or add to queue (YouTube, Spotify, SoundCloud URLs or search terms)
- `/pause` - Pause the current track
- `/resume` - Resume playback
- `/skip` - Skip to next song in queue
- `/stop` - Stop playback and disconnect
- `/queue` - View the current queue
- `/nowplaying` - Show currently playing song
- `/clear` - Clear the entire queue
- `/volume <0-100>` - Set playback volume

### 📊 Leveling Commands

- `/rank [user]` - Check your or another user's rank, level, and XP
- `/leaderboard` - View the server's top 10 users by XP

### ℹ️ Utility Commands

- `/help` - Show all available commands with descriptions

## Configuration

Edit `python-bot/config.py` to customize:

```python
# Leveling Configuration
XP_PER_MESSAGE = 10           # XP awarded per message
XP_COOLDOWN = 60              # Cooldown in seconds between XP gains
LEVEL_UP_BASE = 100           # XP needed for level 1 → 2
LEVEL_UP_FACTOR = 1           # XP multiplier per level

# Bot Settings
COMMAND_PREFIX = '!'          # Legacy prefix (not used with slash commands)
EMBED_COLOR = 0x5865F2        # Discord Blurple
```

## Project Structure

```
python-bot/
├── cogs/
│   ├── music_player.py       # Music playback system
│   ├── queue_manager.py      # Queue management and commands
│   ├── leveling.py           # XP and leveling system
│   └── help.py               # Help command
├── models/
│   └── user.py               # UserManager for MongoDB operations
├── utils/
│   └── leveling.py           # XP cooldown utilities
├── bot.py                    # Main bot entry point
├── config.py                 # Configuration settings
├── requirements.txt          # Python dependencies
└── .env                      # Environment variables (create this)
```

## VPS/Cloud Deployment

### Recommended Providers

1. **Oracle Cloud** - Free tier with 4 ARM CPUs, 24GB RAM
2. **DigitalOcean** - $6/month droplet
3. **Vultr** - Similar pricing to DO
4. **AWS EC2** - Free tier for 12 months
5. **Linode** - $5/month instances

### Deployment Steps

#### 1. Set Up Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.10+
sudo apt install -y python3 python3-pip python3-venv

# Install MongoDB 7.0
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install FFmpeg
sudo apt install -y ffmpeg

# Install git
sudo apt install -y git
```

#### 2. Clone and Setup

```bash
# Clone repository
cd ~
git clone <your-repo-url> DiscBot
cd DiscBot/python-bot

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
nano .env  # Add your DISCORD_TOKEN
```

#### 3. Run with Screen (Simple Method)

```bash
# Install screen
sudo apt install -y screen

# Start a screen session
screen -S discord-bot

# Run the bot
python3 bot.py

# Detach from screen: Press Ctrl+A, then D
# Reattach: screen -r discord-bot
```

#### 4. Run with systemd (Production Method)

Create a systemd service file:

```bash
sudo nano /etc/systemd/system/discord-bot.service
```

Add this content:

```ini
[Unit]
Description=ZenithWave Discord Bot
After=network.target mongod.service

[Service]
Type=simple
User=your-username
WorkingDirectory=/home/your-username/DiscBot/python-bot
Environment="PATH=/home/your-username/DiscBot/python-bot/venv/bin"
ExecStart=/home/your-username/DiscBot/python-bot/venv/bin/python3 bot.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable discord-bot
sudo systemctl start discord-bot

# Check status
sudo systemctl status discord-bot

# View logs
sudo journalctl -u discord-bot -f
```

## MongoDB Cloud (MongoDB Atlas)

Instead of self-hosting MongoDB:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster (512MB storage)
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for any IP)
5. Get your connection string
6. Update `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/discordbot?retryWrites=true&w=majority
```

## Troubleshooting

### Commands not appearing

```bash
# The bot syncs commands automatically on startup
# Check terminal for: "Synced X command(s)"
# Wait a few minutes for Discord to update globally
```

### Music not playing

1. Verify FFmpeg is installed: `ffmpeg -version`
2. Check bot has "Connect" and "Speak" permissions
3. Try updating yt-dlp: `pip install --upgrade yt-dlp`

### MongoDB connection errors

```bash
# Check MongoDB is running
sudo systemctl status mongod

# View MongoDB logs
sudo journalctl -u mongod -n 50

# Test connection
mongosh discordbot --eval "db.users.find().pretty()"
```

### Leveling not working

1. Send some messages in Discord (wait 60 seconds between messages)
2. Check terminal for `[Rank]` or `[Leaderboard]` debug messages
3. Verify MongoDB connection
4. Check database: `mongosh discordbot --eval "db.users.find().pretty()"`

### Queue not working / showing empty

1. Check terminal for `[QueueManager id=...]` messages
2. Verify same instance ID appears for Set and Get operations
3. Restart bot if needed

## Key Dependencies

- **discord.py** 2.6.4 - Discord API wrapper
- **yt-dlp** 2025.12.8 - YouTube and media extraction
- **motor** 3.7.0 - Async MongoDB driver
- **python-dotenv** 1.0.1 - Environment variable management
- **PyNaCl** 1.5.0 - Voice encryption

## Security Best Practices

- Never commit `.env` to Git (already in `.gitignore`)
- Use strong, unique bot token
- Keep dependencies updated: `pip install --upgrade -r requirements.txt`
- Use MongoDB authentication in production
- Enable firewall on VPS: `sudo ufw enable`
- Regular database backups

## Database Backup

```bash
# Manual backup
mongodump --uri="mongodb://localhost:27017/discordbot" --out=/backup/$(date +%Y%m%d)

# Restore backup
mongorestore --uri="mongodb://localhost:27017/discordbot" /backup/20250101/discordbot
```

## Monitoring and Logs

```bash
# View bot logs (if using systemd)
sudo journalctl -u discord-bot -f

# View MongoDB logs
sudo journalctl -u mongod -f

# Check bot resource usage
htop
```

## Common Issues

### Import errors
```bash
# Make sure virtual environment is activated
source venv/bin/activate
pip install -r requirements.txt
```

### Permission denied on VPS
```bash
# Make sure files have correct permissions
chmod +x bot.py
chown -R your-user:your-user ~/DiscBot
```

### Voice disconnects randomly
- Check network stability
- Ensure FFmpeg is properly installed
- Try reducing bitrate in music_player.py

## Contributing

Feel free to fork and submit pull requests for improvements!

## Support

For issues, create a GitHub issue with:
- Bot version (discord.py version from `pip show discord.py`)
- Python version (`python3 --version`)
- Error logs from terminal
- Steps to reproduce

## License

MIT License - feel free to use and modify for your own projects.

## Credits

- Built with [discord.py](https://github.com/Rapptz/discord.py)
- Music extraction via [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- Database by [MongoDB](https://www.mongodb.com/)

---

**Bot Status**: ✅ Fully functional music player with queue + leveling system
**Last Updated**: January 2026
