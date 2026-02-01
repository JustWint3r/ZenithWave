import { ActivityType } from 'discord.js';

export default {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Bot is in ${client.guilds.cache.size} guilds`);
    console.log(`Serving ${client.users.cache.size} users`);

    // Set initial status
    updateStatus(client);

    // Update status every 5 minutes to keep server count current
    setInterval(() => updateStatus(client), 5 * 60 * 1000);

    console.log('Bot is ready!');
  },
};

function updateStatus(client) {
  const serverCount = client.guilds.cache.size;

  client.user.setPresence({
    activities: [{
      name: `/help - [${serverCount}] servers`,
      type: ActivityType.Watching
    }],
    status: 'online',
  });
}
