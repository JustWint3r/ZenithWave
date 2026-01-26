import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getLeaderboard } from '../../utils/levelingUtils.js';
import config from '../../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the server leaderboard')
    .addIntegerOption(option =>
      option
        .setName('page')
        .setDescription('Page number (10 users per page)')
        .setMinValue(1)
        .setRequired(false)
    ),

  async execute(interaction) {
    const page = interaction.options.getInteger('page') || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    await interaction.deferReply();

    const leaderboard = await getLeaderboard(interaction.guild.id, limit);

    if (leaderboard.length === 0) {
      return interaction.editReply('No users found on the leaderboard yet!');
    }

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle(`${interaction.guild.name} Leaderboard`)
      .setDescription('Top users by level and XP')
      .setTimestamp()
      .setFooter({ text: `Page ${page}` });

    const medals = ['🥇', '🥈', '🥉'];

    for (const entry of leaderboard) {
      const user = await interaction.client.users.fetch(entry.userId).catch(() => null);
      const username = user ? user.username : 'Unknown User';
      const medal = entry.rank <= 3 ? medals[entry.rank - 1] : `#${entry.rank}`;

      embed.addFields({
        name: `${medal} ${username}`,
        value: `Level: ${entry.level} | XP: ${entry.xp} | Messages: ${entry.messageCount}`,
        inline: false
      });
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
