import mongoose from 'mongoose';

const guildSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  settings: {
    levelingEnabled: {
      type: Boolean,
      default: true,
    },
    xpPerMessage: {
      type: Number,
      default: 10,
    },
    xpCooldown: {
      type: Number,
      default: 60000,
    },
    levelUpMessage: {
      type: Boolean,
      default: true,
    },
    levelUpChannel: {
      type: String,
      default: null,
    },
    musicVolume: {
      type: Number,
      default: 50,
    },
    ignoredChannels: {
      type: [String],
      default: [],
    },
  },
}, {
  timestamps: true,
});

export default mongoose.model('Guild', guildSchema);
