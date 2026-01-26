import dotenv from 'dotenv';
dotenv.config();

export default {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/discordbot',

  leveling: {
    xpPerMessage: parseInt(process.env.XP_PER_MESSAGE) || 10,
    xpCooldown: parseInt(process.env.XP_COOLDOWN) || 60000,
    levelMultiplier: parseInt(process.env.LEVEL_MULTIPLIER) || 100,
  },

  music: {
    maxQueueSize: parseInt(process.env.MAX_QUEUE_SIZE) || 100,
    defaultVolume: parseInt(process.env.DEFAULT_VOLUME) || 50,
  },

  colors: {
    primary: 0x5865F2,
    success: 0x57F287,
    warning: 0xFEE75C,
    error: 0xED4245,
  }
};
