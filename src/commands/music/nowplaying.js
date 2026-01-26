import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';
import config from '../../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Show the currently playing song'),

  async execute(interaction) {
    const player = useMainPlayer();
    const queue = player.nodes.get(interaction.guildId);

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({
        content: 'There is no music playing!',
        ephemeral: true
      });
    }

    const track = queue.currentTrack;
    const progress = queue.node.createProgressBar();

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle('Now Playing')
      .setDescription(`[${track.title}](${track.url})`)
      .setThumbnail(track.thumbnail)
      .addFields(
        { name: 'Artist', value: track.author, inline: true },
        { name: 'Duration', value: track.duration, inline: true },
        { name: 'Requested by', value: track.requestedBy.toString(), inline: true },
        { name: 'Progress', value: progress, inline: false }
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
