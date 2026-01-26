# Bot Commands Reference

## Leveling Commands

### /rank [user]
Check rank and level information.

**Usage:**
- `/rank` - Check your own rank
- `/rank @username` - Check another user's rank

**Response includes:**
- Current rank in server
- Current level
- Total messages sent
- XP progress to next level
- Visual progress bar

**Example:**
```
/rank
/rank @JohnDoe
```

---

### /leaderboard [page]
View the server leaderboard.

**Usage:**
- `/leaderboard` - View page 1
- `/leaderboard 2` - View page 2

**Features:**
- Shows top 10 users per page
- Displays level, XP, and message count
- Medal icons for top 3 users (🥇🥈🥉)

**Example:**
```
/leaderboard
/leaderboard 2
```

---

## Music Commands

### /play <query>
Play music from various platforms.

**Supported Platforms:**
- YouTube (videos and playlists)
- YouTube Music
- Spotify (tracks and playlists)
- SoundCloud
- Apple Music
- Bandcamp
- Direct URLs

**Usage:**
```
/play never gonna give you up
/play https://www.youtube.com/watch?v=dQw4w9WgXcQ
/play https://open.spotify.com/track/...
/play https://soundcloud.com/...
```

**Features:**
- Auto-search if not a URL
- Playlist support
- Adds to queue if music is already playing
- Shows what's playing/queued

---

### /pause
Pause the currently playing song.

**Requirements:**
- Must be in the same voice channel as the bot
- Music must be playing

**Usage:**
```
/pause
```

---

### /resume
Resume the paused song.

**Requirements:**
- Must be in the same voice channel as the bot
- Music must be paused

**Usage:**
```
/resume
```

---

### /skip
Skip the current song and play the next one in queue.

**Requirements:**
- Must be in the same voice channel as the bot
- Music must be playing

**Usage:**
```
/skip
```

---

### /stop
Stop the music and clear the entire queue.

**Requirements:**
- Must be in the same voice channel as the bot
- Music must be playing

**Usage:**
```
/stop
```

**Note:** This will disconnect the bot from the voice channel.

---

### /queue
Display the current music queue.

**Features:**
- Shows currently playing track
- Lists next 10 tracks in queue
- Displays total queue size
- Shows volume and loop mode

**Usage:**
```
/queue
```

---

### /nowplaying
Show detailed information about the currently playing song.

**Features:**
- Song title and artist
- Duration
- Who requested the song
- Visual progress bar
- Thumbnail image

**Usage:**
```
/nowplaying
```

---

### /volume <level>
Set the playback volume.

**Requirements:**
- Must be in the same voice channel as the bot
- Music must be playing

**Parameters:**
- `level`: Number between 0-100

**Usage:**
```
/volume 50
/volume 75
/volume 100
```

---

## How the Leveling System Works

### XP Gain
- Users earn XP by sending messages in any text channel
- Default: 10 XP per message
- Cooldown: 60 seconds between XP gains (configurable)
- Bots don't earn XP

### Level Calculation
- Level 1 → Level 2: 100 XP
- Level 2 → Level 3: 200 XP
- Level 3 → Level 4: 300 XP
- Formula: Required XP = Current Level × 100

### Level Up Notifications
- Automatic notification when user levels up
- Sent in the channel where they leveled up
- Shows new level and XP progress

### Leaderboard
- Sorted by level (primary) and XP (secondary)
- Shows top users across the entire server
- Updates in real-time

---

## Music System Features

### Queue Management
- Unlimited queue size (configurable)
- First-in-first-out (FIFO) order
- Playlist support (adds all songs to queue)

### Audio Quality
- High quality audio streaming
- Optimized buffering
- Low latency playback

### Automatic Features
- Auto-disconnect when voice channel is empty
- Queue finish notification
- Track change announcements

---

## Permissions Required

### For Leveling System:
- Read Messages/View Channels
- Send Messages
- Embed Links

### For Music System:
- Connect (to voice channels)
- Speak (in voice channels)
- Use Voice Activity
- Read Messages/View Channels
- Send Messages
- Embed Links

---

## Tips and Tricks

### Leveling
1. Active chatting earns XP faster
2. Check `/leaderboard` to see competition
3. Use `/rank @user` to compare with friends

### Music
1. Create playlists by using Spotify/YouTube playlist URLs
2. Queue up multiple songs before they start playing
3. Use `/queue` to see what's coming up
4. Adjust volume to your preference with `/volume`
5. The bot will automatically leave if everyone exits the voice channel

---

## Command Rate Limiting

To prevent abuse, commands have built-in rate limiting:
- Leveling commands: No spam protection needed (real-time data)
- Music commands: Protected against rapid-fire usage
- XP gain: 60-second cooldown per user

---

## Configuration

Server administrators can configure:
- XP per message
- XP cooldown time
- Level up message toggle
- Default music volume
- Ignored channels for XP

These settings are stored in the database per-server.
