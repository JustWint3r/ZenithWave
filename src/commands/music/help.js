import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import config from '../../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available bot commands'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle('Bot Commands')
      .setDescription('Here are all available commands:')
      .addFields(
        {
          name: '🎵 Music',
          value: [
            '`/play <query>` - Play a song or add to queue',
            '`/pause` - Pause the current song',
            '`/resume` - Resume playback',
            '`/skip` - Skip to next song',
            '`/stop` - Stop and disconnect',
            '`/queue` - View the queue',
            '`/nowplaying` - Show currently playing song',
            '`/volume <0-100>` - Set playback volume',
          ].join('\n'),
          inline: false,
        },
        {
          name: '📊 Leveling',
          value: [
            '`/rank` - Check your rank and XP',
            '`/leaderboard` - View top users',
          ].join('\n'),
          inline: false,
        },
        {
          name: 'ℹ️ Utility',
          value: '`/help` - Show this message',
          inline: false,
        }
      )
      .setFooter({ text: 'Use / to see all available slash commands' });

    return interaction.reply({ embeds: [embed] });
  },
};
