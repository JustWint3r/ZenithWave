import { SlashCommandBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song'),

  async execute(interaction) {
    const player = useMainPlayer();
    const queue = player.nodes.get(interaction.guildId);

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({
        content: 'There is no music playing!',
        ephemeral: true
      });
    }

    if (!interaction.member.voice.channel) {
      return interaction.reply({
        content: 'You need to be in a voice channel to control music!',
        ephemeral: true
      });
    }

    const currentTrack = queue.currentTrack;
    queue.node.skip();

    return interaction.reply({
      content: `Skipped **${currentTrack.title}**`
    });
  },
};
