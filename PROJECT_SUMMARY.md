# Discord Bot Project Summary

## Overview

This is a fully functional Discord bot built with Discord.js v14 that includes:
- **Message Logging & Leveling System**: Tracks all messages, awards XP, and maintains a leaderboard
- **Multi-Platform Music Player**: Plays music from YouTube, Spotify, SoundCloud, and more

## Tech Stack

### Core Technologies
- **Runtime**: Node.js 18+
- **Language**: JavaScript (ES Modules)
- **Framework**: Discord.js v14
- **Database**: MongoDB with Mongoose ODM
- **Music Engine**: discord-player v6

### Key Dependencies
- `discord.js` - Discord API wrapper
- `discord-player` - Music playback system
- `discord-player-youtubei` - YouTube extractor
- `@discord-player/extractor` - Multi-platform support
- `play-dl` - Additional music sources
- `mongoose` - MongoDB object modeling
- `@discordjs/voice` - Voice connection handling
- `ffmpeg-static` - Audio processing

## Project Structure

```
discord-bot/
├── config/
│   └── config.js                    # Centralized configuration
│
├── src/
│   ├── commands/
│   │   ├── leveling/
│   │   │   ├── rank.js             # View user rank/level
│   │   │   └── leaderboard.js      # Server leaderboard
│   │   └── music/
│   │       ├── play.js             # Play music
│   │       ├── pause.js            # Pause playback
│   │       ├── resume.js           # Resume playback
│   │       ├── skip.js             # Skip track
│   │       ├── stop.js             # Stop and clear queue
│   │       ├── queue.js            # View queue
│   │       ├── nowplaying.js       # Current track info
│   │       └── volume.js           # Volume control
│   │
│   ├── events/
│   │   ├── ready.js                # Bot startup
│   │   ├── messageCreate.js        # Message tracking & XP
│   │   └── interactionCreate.js   # Slash command handler
│   │
│   ├── models/
│   │   ├── User.js                 # User data schema
│   │   └── Guild.js                # Guild settings schema
│   │
│   ├── utils/
│   │   └── levelingUtils.js        # XP/leveling utilities
│   │
│   ├── index.js                    # Main bot file
│   └── deploy-commands.js          # Command deployment
│
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies & scripts
├── Dockerfile                      # Docker configuration
├── docker-compose.yml              # Docker Compose setup
├── ecosystem.config.js             # PM2 configuration
│
├── README.md                       # Main documentation
├── SETUP_GUIDE.md                  # Quick setup guide
├── COMMANDS.md                     # Command reference
├── DEPLOYMENT_CHECKLIST.md         # Deployment guide
└── PROJECT_SUMMARY.md              # This file
```

## Features

### 1. Leveling System

**Message Tracking**
- Monitors all messages in all channels
- Logs message count per user
- Stores data in MongoDB

**XP System**
- Awards 10 XP per message (configurable)
- 60-second cooldown between XP gains
- Prevents spam and abuse

**Level Progression**
- Formula: Required XP = Current Level × 100
- Level 1→2: 100 XP
- Level 2→3: 200 XP
- Level 3→4: 300 XP
- And so on...

**Commands**
- `/rank [user]` - Check rank and level
- `/leaderboard [page]` - View top users

**Features**
- Real-time XP tracking
- Automatic level-up notifications
- Beautiful embeds with progress bars
- Server-wide leaderboard
- Rank comparison

### 2. Music System

**Platform Support**
- YouTube (videos & playlists)
- YouTube Music
- Spotify (tracks & playlists)
- SoundCloud
- Apple Music
- Bandcamp
- Direct audio URLs

**Music Commands**
- `/play <query>` - Play music
- `/pause` - Pause playback
- `/resume` - Resume playback
- `/skip` - Skip current track
- `/stop` - Stop and clear queue
- `/queue` - View music queue
- `/nowplaying` - Current track info
- `/volume <level>` - Set volume (0-100)

**Features**
- Unlimited queue size
- Playlist support
- High-quality audio
- Progress bars
- Auto-disconnect on empty channel
- Rich embeds with track info

### 3. Database Integration

**MongoDB Collections**
- `users` - User XP and level data
- `guilds` - Server settings

**Data Persistence**
- All user progress saved
- Survives bot restarts
- Configurable per-guild settings

### 4. Security Features

- Environment variable configuration
- No hardcoded secrets
- Permission checks on commands
- Rate limiting on XP gains
- Input validation
- Error handling

## Deployment Options

### 1. Local Development
```bash
npm install
npm run deploy
npm start
```

### 2. VPS with PM2
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 3. Docker
```bash
docker-compose up -d
```

### 4. Cloud Platforms
- DigitalOcean App Platform
- AWS EC2
- Google Cloud Run
- Heroku
- Railway
- Fly.io

## Configuration

### Environment Variables
```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id
MONGODB_URI=mongodb://localhost:27017/discordbot
XP_PER_MESSAGE=10
XP_COOLDOWN=60000
LEVEL_MULTIPLIER=100
MAX_QUEUE_SIZE=100
DEFAULT_VOLUME=50
```

### Bot Permissions Required
- Read Messages/View Channels
- Send Messages
- Embed Links
- Connect (voice)
- Speak (voice)
- Use Voice Activity

### Gateway Intents Required
- GUILDS
- GUILD_MESSAGES
- MESSAGE_CONTENT
- GUILD_VOICE_STATES
- GUILD_MEMBERS

## File Sizes

- Total Dependencies: ~150MB (node_modules)
- Source Code: ~50KB
- Docker Image: ~300MB
- MongoDB: Varies with usage

## Performance

### Resource Usage (Typical)
- CPU: 1-5% idle, 10-20% with music
- RAM: 100-200MB idle, 200-500MB with music
- Disk: Minimal (logs + database)
- Network: Depends on music streaming

### Scalability
- Handles multiple servers
- Concurrent music playback
- Thousands of users
- Database indexing for speed

## Monitoring

### Logs
- Console output
- PM2 logs (`pm2 logs`)
- Docker logs (`docker-compose logs`)
- MongoDB logs

### Health Checks
- Bot online status
- Database connection
- Voice connection status
- Error rate

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Database backups weekly
- Log rotation
- Security patches
- Performance monitoring

### Update Procedure
```bash
git pull
npm update
npm run deploy
pm2 restart discord-bot
```

## Backup Strategy

### Database Backup
```bash
mongodump --uri="mongodb://localhost:27017/discordbot" --out=/backup/$(date +%Y%m%d)
```

### Code Backup
- Git version control
- Regular commits
- Remote repository (GitHub/GitLab)

### Environment Backup
- Secure `.env` file backup
- Encrypted storage
- Multiple locations

## Troubleshooting

Common issues and solutions documented in:
- [README.md](README.md) - General troubleshooting
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Setup issues
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Deployment issues

## Future Enhancements

Potential features to add:
- Custom XP multipliers per channel
- Role rewards at certain levels
- Custom level-up messages
- Music playlist saving
- DJ role requirement
- Vote skip functionality
- Economy system
- Moderation commands
- Custom commands
- Web dashboard

## Support

### Documentation
- README.md - Main documentation
- SETUP_GUIDE.md - Quick start
- COMMANDS.md - Command reference
- DEPLOYMENT_CHECKLIST.md - Deployment guide

### External Resources
- [Discord.js Guide](https://discordjs.guide/)
- [Discord.js Documentation](https://discord.js.org/)
- [Discord Player Docs](https://discord-player.js.org/)
- [MongoDB Manual](https://docs.mongodb.com/)

## License

MIT License - Free to use and modify

## Credits

Built with:
- Discord.js by discordjs team
- discord-player by Androz2091
- MongoDB by MongoDB Inc.
- Node.js by OpenJS Foundation

---

**Version**: 1.0.0
**Last Updated**: 2025-12-09
**Node Version**: 18+
**Discord.js Version**: 14.14.1
