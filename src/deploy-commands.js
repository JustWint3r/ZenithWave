import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const commandFolders = ['leveling', 'music'];

for (const folder of commandFolders) {
  const commandsPath = path.join(__dirname, 'commands', folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(`file://${filePath}`);

    if ('data' in command.default && 'execute' in command.default) {
      commands.push(command.default.data.toJSON());
      console.log(`Loaded command: ${command.default.data.name}`);
    } else {
      console.log(`Warning: The command at ${filePath} is missing required "data" or "execute" property.`);
    }
  }
}

const rest = new REST().setToken(config.token);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    let data;

    if (config.guildId) {
      data = await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands },
      );
      console.log(`Successfully reloaded ${data.length} guild commands.`);
    } else {
      data = await rest.put(
        Routes.applicationCommands(config.clientId),
        { body: commands },
      );
      console.log(`Successfully reloaded ${data.length} global commands.`);
    }
  } catch (error) {
    console.error('Error deploying commands:', error);
  }
})();
