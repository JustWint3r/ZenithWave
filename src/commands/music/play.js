import { SlashCommandBuilder } from 'discord.js';
import { useMainPlayer, QueryType } from 'discord-player';

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
      console.log(`[PLAY] Query: "${query}", registered extractors:`, [...player.extractors.store.keys()]);
      const searchResult = await player.search(query, {
        searchEngine: QueryType.YOUTUBE_SEARCH,
        requestedBy: interaction.user
      });
      console.log(`[PLAY] Search result: tracks=${searchResult.tracks.length}, extractor=${searchResult.extractor?.identifier ?? 'N/A'}`);
      if (searchResult.isEmpty()) {
        return interaction.editReply({ content: `No results found for "${query}"` });
      }
      const { track } = await player.play(interaction.member.voice.channel, searchResult, {
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
