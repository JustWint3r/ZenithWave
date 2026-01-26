import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getUserStats } from '../../utils/levelingUtils.js';
import config from '../../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Check your rank and level')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to check (defaults to you)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const guildId = interaction.guild.id;

    await interaction.deferReply();

    const stats = await getUserStats(targetUser.id, guildId);

    if (!stats) {
      return interaction.editReply({
        content: `${targetUser.username} hasn't earned any XP yet!`,
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setAuthor({
        name: targetUser.username,
        iconURL: targetUser.displayAvatarURL({ dynamic: true })
      })
      .setTitle('Rank Information')
      .addFields(
        { name: 'Rank', value: `#${stats.rank} / ${stats.totalUsers}`, inline: true },
        { name: 'Level', value: `${stats.level}`, inline: true },
        { name: 'Messages', value: `${stats.messageCount}`, inline: true },
        { name: 'XP Progress', value: `${stats.xp} / ${stats.requiredXp} (${stats.progress.percentage}%)`, inline: false }
      )
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    const progressBar = createProgressBar(stats.progress.percentage);
    embed.addFields({ name: 'Progress', value: progressBar, inline: false });

    await interaction.editReply({ embeds: [embed] });
  },
};

function createProgressBar(percentage) {
  const filled = Math.floor(percentage / 10);
  const empty = 10 - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percentage}%`;
}
