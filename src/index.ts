import * as config from "./config";
import { Bot } from "./types/Bot";
import { loadCommands, loadEvents } from "./util/botLoader";

export const bot = new Bot({
  intents: ["GUILDS", "GUILD_VOICE_STATES", "GUILD_MEMBERS", "GUILD_MESSAGES"],
});

loadCommands(bot);
loadEvents(bot);

bot.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = bot.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

bot.login(config.token);
