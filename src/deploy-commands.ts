import { REST } from "@discordjs/rest";
import chalk from "chalk";
import { Routes } from "discord-api-types/v9";
import fs from "fs";
import path from "path";

import { clientId, guildId, token } from "./config";

const commands: any[] = [];
const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const { command } = require(path.join(__dirname, `commands/${file}`));
  //   console.dir(command, { depth: 5 });
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);

async function init() {
  try {
    console.log(
      chalk.bgGreen.bold("Started refreshing application (/) commands.")
    );

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });
    console.log(
      chalk.bgGreen.bold(`Succesfully registered application commands!`)
    );
  } catch (error) {
    console.error(error);
  }
}

init();
