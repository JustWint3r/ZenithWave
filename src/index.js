import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { Player } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/config.js';

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
  }
});

// Load YouTubei extractor (more stable than default YouTube extractor)
await player.extractors.register(YoutubeiExtractor, {});
// Load other default extractors for Spotify, SoundCloud, etc.
await player.extractors.loadDefault((ext) => ext !== 'YoutubeExtractor');
console.log('Loaded YouTubei extractor and other default extractors (Spotify, SoundCloud, etc.)');

player.events.on('playerStart', (queue, track) => {
  queue.metadata.channel.send(`Now playing: **${track.title}** by **${track.author}**`);
});

player.events.on('audioTrackAdd', (queue, track) => {
  queue.metadata.channel.send(`Track **${track.title}** added to queue`);
});

player.events.on('emptyQueue', (queue) => {
  queue.metadata.channel.send('Queue finished!');
});

player.events.on('emptyChannel', (queue) => {
  queue.metadata.channel.send('Leaving voice channel - nobody is listening!');
});

player.events.on('playerError', (queue, error) => {
  console.error(`Player error: ${error.message}`);
  console.error(error);
  if (queue?.metadata?.channel) {
    queue.metadata.channel.send(`Error playing track: ${error.message}`);
  }
});

player.events.on('error', (queue, error) => {
  console.error(`General player error: ${error.message}`);
  console.error(error);
  if (queue?.metadata?.channel) {
    queue.metadata.channel.send(`An error occurred: ${error.message}`);
  }
});

player.events.on('debug', (queue, message) => {
  console.log(`[DEBUG] ${message}`);
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
