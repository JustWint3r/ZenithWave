import User from '../models/User.js';
import config from '../../config/config.js';

const xpCooldowns = new Map();

export async function handleMessageXp(message) {
  if (message.author.bot) return;
  if (!message.guild) return;

  const userId = message.author.id;
  const guildId = message.guild.id;
  const cooldownKey = `${userId}-${guildId}`;

  if (xpCooldowns.has(cooldownKey)) {
    const expirationTime = xpCooldowns.get(cooldownKey);
    if (Date.now() < expirationTime) {
      return null;
    }
  }

  try {
    let user = await User.findOne({ userId, guildId });

    if (!user) {
      user = new User({
        userId,
        guildId,
        xp: 0,
        level: 1,
        messageCount: 0,
      });
    }

    const xpGained = config.leveling.xpPerMessage;
    const leveledUp = user.addXp(xpGained);
    await user.save();

    xpCooldowns.set(cooldownKey, Date.now() + config.leveling.xpCooldown);

    setTimeout(() => {
      xpCooldowns.delete(cooldownKey);
    }, config.leveling.xpCooldown);

    return {
      leveledUp,
      newLevel: user.level,
      xp: user.xp,
      requiredXp: user.getRequiredXp(),
    };
  } catch (error) {
    console.error('Error handling message XP:', error);
    return null;
  }
}

export async function getUserStats(userId, guildId) {
  try {
    const user = await User.findOne({ userId, guildId });
    if (!user) return null;

    const allUsers = await User.find({ guildId }).sort({ level: -1, xp: -1 });
    const rank = allUsers.findIndex(u => u.userId === userId) + 1;

    return {
      level: user.level,
      xp: user.xp,
      messageCount: user.messageCount,
      requiredXp: user.getRequiredXp(),
      progress: user.getProgress(),
      rank,
      totalUsers: allUsers.length,
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
}

export async function getLeaderboard(guildId, limit = 10) {
  try {
    const users = await User.find({ guildId })
      .sort({ level: -1, xp: -1 })
      .limit(limit);

    return users.map((user, index) => ({
      rank: index + 1,
      userId: user.userId,
      level: user.level,
      xp: user.xp,
      messageCount: user.messageCount,
    }));
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}
