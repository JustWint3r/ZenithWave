import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  messageCount: {
    type: Number,
    default: 0,
  },
  lastXpGain: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

userSchema.index({ userId: 1, guildId: 1 }, { unique: true });

userSchema.methods.addXp = function(amount) {
  this.xp += amount;
  this.messageCount += 1;
  this.lastXpGain = new Date();

  const requiredXp = this.level * 100;
  if (this.xp >= requiredXp) {
    this.level += 1;
    this.xp = this.xp - requiredXp;
    return true;
  }
  return false;
};

userSchema.methods.getRequiredXp = function() {
  return this.level * 100;
};

userSchema.methods.getProgress = function() {
  const required = this.getRequiredXp();
  return {
    current: this.xp,
    required: required,
    percentage: Math.floor((this.xp / required) * 100)
  };
};

export default mongoose.model('User', userSchema);
