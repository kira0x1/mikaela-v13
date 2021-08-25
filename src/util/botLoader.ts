import { Bot } from "../types/Bot";
import path from "path";
import fs from "fs";

export async function loadCommands(bot: Bot) {
  const commandFiles = fs
    .readdirSync(path.join(__dirname, "../commands"))
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    console.log(`attempting to read: ${file}`);
    const { command } = require(path.join(__dirname, `../commands/${file}`));
    if (!command) {
      console.dir(command, { depth: 5 });
      continue;
    }
    bot.commands.set(command.data.name, command);
  }
}

export async function loadEvents(bot: Bot) {
  const eventFiles = fs
    .readdirSync(path.join(__dirname, "../events"))
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const { event } = require(path.join(__dirname, `../events/${file}`));

    if (event.once) bot.once(event.name, (...args) => event.execute(...args));
    else bot.on(event.name, (...args) => event.execute(...args));
  }
}
