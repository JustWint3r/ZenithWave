import { SlashCommandBuilder } from 'discord.js';
import { useMainPlayer, QueryType } from 'discord-player';
import { prewarm } from '../../streamCache.js';

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

    // If it's a direct YouTube URL, start fetching the stream URL immediately
    // so it's ready in cache by the time createStream is called
    const videoId = query.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
    if (videoId) {
      const cookieFilePath = process.env.YOUTUBE_COOKIE ? '/tmp/yt-cookies.txt' : null;
      prewarm(videoId, cookieFilePath);
    }

    try {
      const { track } = await player.play(interaction.member.voice.channel, query, {
        searchEngine: QueryType.YOUTUBE_SEARCH,
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

      if (interaction.deferred || interaction.replied) {
        return interaction.editReply({
          content: `Something went wrong: ${error.message}`
        }).catch(console.error);
      }
    }
  },
};
