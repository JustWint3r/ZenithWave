import { SlashCommandBuilder } from 'discord.js';
import { useMainPlayer, QueryType } from 'discord-player';
import { fetchStreamUrl } from '../../streamCache.js';

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

    await interaction.deferReply();

    if (!interaction.member.voice.channel) {
      return interaction.editReply({
        content: 'You need to be in a voice channel to play music!'
      });
    }

    const query = interaction.options.getString('query');
    const cookieFilePath = process.env.COOKIE_FILE || (process.env.YOUTUBE_COOKIE ? '/tmp/yt-cookies.txt' : null);

    // Search first to get the videoId, then pre-fetch the stream URL
    // so it's already cached when createStream is called
    try {
      const searchResult = await player.search(query, {
        searchEngine: QueryType.YOUTUBE_SEARCH,
      });

      if (!searchResult.hasTracks()) {
        return interaction.editReply({ content: 'No results found!' });
      }

      const track = searchResult.tracks[0];
      const videoId = track.url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];

      // Pre-fetch and cache the stream URL BEFORE joining voice / playing
      if (videoId) {
        try {
          await fetchStreamUrl(videoId, cookieFilePath);
        } catch (err) {
          console.error('[yt-dlp] Pre-fetch failed:', err.stderr?.trim() || err.message);
          return interaction.editReply({ content: `Could not fetch stream: ${err.message}` });
        }
      }

      const { track: playedTrack } = await player.play(interaction.member.voice.channel, searchResult, {
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
        content: `Added **${playedTrack.title}** to the queue!`
      });

    } catch (error) {
      console.error('Error playing track:', error);

      if (interaction.deferred || interaction.replied) {
        return interaction.editReply({
          content: `Something went wrong: ${error.message}`
        }).catch(console.error);
      }
    }
  },
};
