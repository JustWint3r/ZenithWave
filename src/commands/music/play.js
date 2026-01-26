import { SlashCommandBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music from YouTube, Spotify, SoundCloud, or other platforms')
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('Song name, URL, or playlist URL')
        .setRequired(true)
    ),

  async execute(interaction) {
    const player = useMainPlayer();

    // Defer reply immediately to prevent timeout
    await interaction.deferReply();

    if (!interaction.member.voice.channel) {
      return interaction.editReply({
        content: 'You need to be in a voice channel to play music!'
      });
    }

    const query = interaction.options.getString('query');

    try {
      // Determine search engine based on query
      let searchEngine = 'youtube'; // Default to YouTube

      if (query.includes('spotify.com')) {
        searchEngine = 'spotify';
      } else if (query.includes('soundcloud.com')) {
        searchEngine = 'soundcloud';
      } else if (query.includes('apple.com') || query.includes('music.apple')) {
        searchEngine = 'apple_music';
      }

      const { track } = await player.play(interaction.member.voice.channel, query, {
        searchEngine: searchEngine,
        nodeOptions: {
          metadata: {
            channel: interaction.channel,
            client: interaction.guild.members.me,
            requestedBy: interaction.user
          },
          selfDeaf: true,
          volume: 50,
          leaveOnEmpty: true,
          leaveOnEmptyCooldown: 300000,
          leaveOnEnd: true,
          leaveOnEndCooldown: 300000
        }
      });

      return interaction.editReply({
        content: `Added **${track.title}** to the queue!`
      });

    } catch (error) {
      console.error('Error playing track:', error);

      // Check if interaction has been replied to
      if (interaction.deferred || interaction.replied) {
        return interaction.editReply({
          content: `Something went wrong: ${error.message}`
        }).catch(console.error);
      }
    }
  },
};
