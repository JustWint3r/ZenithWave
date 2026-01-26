import { SlashCommandBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';

export default {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume the paused song'),

  async execute(interaction) {
    const player = useMainPlayer();
    const queue = player.nodes.get(interaction.guildId);

    if (!queue) {
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

    queue.node.setPaused(false);

    return interaction.reply({
      content: 'Resumed the music!'
    });
  },
};
