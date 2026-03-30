import http from 'http';
// Start HTTP server immediately so Render detects the port
const port = process.env.PORT || 3000;
http.createServer((req, res) => res.end('OK')).listen(port, '0.0.0.0', () => {
  console.log(`HTTP server listening on port ${port}`);
});

import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { Player } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import mongoose from 'mongoose';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/config.js';
import { fetchStreamUrl, prewarm } from './streamCache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

const player = new Player(client, {
  ytdlOptions: {
    quality: 'highestaudio',
    highWaterMark: 1 << 25,
    filter: 'audioonly'
  },
  connectionTimeout: 120000,  // 2 minutes — give yt-dlp time to fetch URL + start streaming
});

// Parse Netscape cookie file format into a cookie header string
function parseCookieFile(raw) {
  if (!raw) return undefined;
  return raw
    .split('\n')
    .filter(line => line && !line.startsWith('#') && line.includes('\t'))
    .map(line => {
      const parts = line.trim().split('\t');
      if (parts.length < 7) return null;
      return `${parts[5]}=${parts[6]}`;
    })
    .filter(Boolean)
    .join('; ');
}

const cookieHeader = parseCookieFile(process.env.YOUTUBE_COOKIE);
console.log('=== ZenithWave Bot Starting ===');
console.log(`Node version: ${process.version}`);
console.log(`Time: ${new Date().toISOString()}`);
console.log('YOUTUBE_COOKIE set:', !!cookieHeader);
console.log('YOUTUBE_COOKIE raw length:', process.env.YOUTUBE_COOKIE?.length ?? 0);
console.log('YOUTUBE_COOKIE first 50 chars:', JSON.stringify(process.env.YOUTUBE_COOKIE?.slice(0, 50)));
console.log('YOUTUBE_OAUTH set:', !!process.env.YOUTUBE_OAUTH);

// Write Netscape cookie file for yt-dlp (it requires a file path, not a cookie string)
let cookieFilePath = null;
if (process.env.YOUTUBE_COOKIE) {
  cookieFilePath = path.join(os.tmpdir(), 'yt-cookies.txt');
  let cookieContent = process.env.YOUTUBE_COOKIE.replace(/^[^#\n]+/, '').trimStart();
  // Ensure the Netscape header is present — yt-dlp requires it
  if (!cookieContent.includes('# Netscape HTTP Cookie File')) {
    cookieContent = '# Netscape HTTP Cookie File\n# https://curl.se/docs/http-cookies.html\n\n' + cookieContent;
  }
  fs.writeFileSync(cookieFilePath, cookieContent, 'utf8');
  // Log first few lines to verify format (not the actual cookies)
  const lines = cookieContent.split('\n').slice(0, 5);
  console.log('Cookie file written. First lines:', lines);
}

try {
  await player.extractors.register(YoutubeiExtractor, {
    cookie: cookieHeader,
    generateWithPoToken: true,
    logLevel: 'ALL',
    createStream: async (track) => {
      const videoId = track.url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
      if (!videoId) return undefined;
      try {
        return await fetchStreamUrl(videoId, cookieFilePath);
      } catch (err) {
        console.error('[yt-dlp] Error:', err.stderr?.trim() || err.message);
        return undefined;
      }
    },
  });
  console.log('YoutubeiExtractor registered successfully');
} catch (err) {
  console.error('Failed to register YoutubeiExtractor:', err);
}

const defaultResult = await player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');
console.log('Default extractors loaded:', defaultResult);

player.events.on('playerStart', (queue, track) => {
  queue.metadata.channel.send(`Now playing: **${track.title}** by **${track.author}**`);
});

player.events.on('audioTrackAdd', (queue, track) => {
  queue.metadata.channel.send(`Track **${track.title}** added to queue`);
  // Prewarm stream URL cache so it's ready when createStream is called
  const videoId = track.url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
  if (videoId) prewarm(videoId, cookieFilePath);
});

player.events.on('emptyQueue', (queue) => {
  queue.metadata.channel.send('Queue finished!');
});

player.events.on('emptyChannel', (queue) => {
  queue.metadata.channel.send('Leaving voice channel - nobody is listening!');
});

player.events.on('connection', (queue) => {
  const vc = queue.dispatcher?.voiceConnection;
  if (vc) {
    vc.on('stateChange', (oldState, newState) => {
      console.log(`[Voice] ${oldState.status} -> ${newState.status}`);
    });
  }
});

player.events.on('playerError', (queue, error) => {
  console.error(`Player error: ${error.message}`);
  if (error.cause) console.error('Player error cause:', JSON.stringify(error.cause));
  if (queue?.metadata?.channel) {
    queue.metadata.channel.send(`Error playing track: ${error.message}`);
  }
});

player.events.on('error', (queue, error) => {
  console.error(`General player error: ${error.message}`);
  if (error.cause) console.error('Error cause:', error.cause);
  if (queue?.metadata?.channel) {
    queue.metadata.channel.send(`An error occurred: ${error.message}`);
  }
});

async function loadCommands() {
  const commandFolders = ['leveling', 'music'];

  for (const folder of commandFolders) {
    const commandsPath = path.join(__dirname, 'commands', folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(`file://${filePath}`);

      if ('data' in command.default && 'execute' in command.default) {
        client.commands.set(command.default.data.name, command.default);
        console.log(`Loaded command: ${command.default.data.name}`);
      } else {
        console.log(`Warning: The command at ${filePath} is missing required "data" or "execute" property.`);
      }
    }
  }
}

async function loadEvents() {
  const eventsPath = path.join(__dirname, 'events');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(`file://${filePath}`);

    if (event.default.once) {
      client.once(event.default.name, (...args) => event.default.execute(...args));
    } else {
      client.on(event.default.name, (...args) => event.default.execute(...args));
    }
    console.log(`Loaded event: ${event.default.name}`);
  }
}

async function connectDatabase() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB error:', error);
});

async function start() {
  try {
    await connectDatabase();
    await loadCommands();
    await loadEvents();
    await client.login(config.token);
  } catch (error) {
    console.error('Error starting bot:', error);
    process.exit(1);
  }
}


process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();
  client.destroy();
  process.exit(0);
});

start();
