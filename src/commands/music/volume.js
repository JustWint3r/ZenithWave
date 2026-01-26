import { SlashCommandBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';

export default {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Set the music volume')
    .addIntegerOption(option =>
      option
        .setName('level')
        .setDescription('Volume level (0-100)')
        .setMinValue(0)
        .setMaxValue(100)
        .setRequired(true)
    ),

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

    const volume = interaction.options.getInteger('level');
    queue.node.setVolume(volume);

    return interaction.reply({
      content: `Volume set to ${volume}%`
    });
  },
};
