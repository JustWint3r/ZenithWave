import { ActivityType } from 'discord.js';

export default {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Bot is in ${client.guilds.cache.size} guilds`);
    console.log(`Serving ${client.users.cache.size} users`);

    client.user.setPresence({
      activities: [{
        name: 'music and tracking levels',
        type: ActivityType.Playing
      }],
      status: 'online',
    });

    console.log('Bot is ready!');
  },
};
