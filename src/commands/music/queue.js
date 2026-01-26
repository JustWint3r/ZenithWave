import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';
import config from '../../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('View the music queue'),

  async execute(interaction) {
    const player = useMainPlayer();
    const queue = player.nodes.get(interaction.guildId);

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({
        content: 'There is no music playing!',
        ephemeral: true
      });
    }

    const currentTrack = queue.currentTrack;
    const tracks = queue.tracks.toArray();

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle('Music Queue')
      .setDescription(`**Now Playing:**\n[${currentTrack.title}](${currentTrack.url}) - ${currentTrack.author}\nRequested by: ${currentTrack.requestedBy}`)
      .setThumbnail(currentTrack.thumbnail);

    if (tracks.length > 0) {
      const queueList = tracks.slice(0, 10).map((track, index) => {
        return `${index + 1}. [${track.title}](${track.url}) - ${track.author}`;
      }).join('\n');

      embed.addFields({
        name: `Up Next (${tracks.length} track${tracks.length > 1 ? 's' : ''})`,
        value: queueList
      });

      if (tracks.length > 10) {
        embed.setFooter({ text: `And ${tracks.length - 10} more...` });
      }
    } else {
      embed.addFields({
        name: 'Up Next',
        value: 'No tracks in queue'
      });
    }

    embed.addFields(
      { name: 'Volume', value: `${queue.node.volume}%`, inline: true },
      { name: 'Loop Mode', value: queue.repeatMode ? 'Enabled' : 'Disabled', inline: true }
    );

    return interaction.reply({ embeds: [embed] });
  },
};
