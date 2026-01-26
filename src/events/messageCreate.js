import { EmbedBuilder } from 'discord.js';
import { handleMessageXp } from '../utils/levelingUtils.js';
import config from '../../config/config.js';

export default {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const xpResult = await handleMessageXp(message);

    if (xpResult && xpResult.leveledUp) {
      const levelUpEmbed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle('Level Up!')
        .setDescription(`${message.author}, you've reached **Level ${xpResult.newLevel}**!`)
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'Current XP', value: `${xpResult.xp}/${xpResult.requiredXp}`, inline: true }
        )
        .setTimestamp();

      try {
        await message.channel.send({ embeds: [levelUpEmbed] });
      } catch (error) {
        console.error('Error sending level up message:', error);
      }
    }
  },
};
