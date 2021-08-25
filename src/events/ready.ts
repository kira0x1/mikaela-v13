import chalk from "chalk";
import { bot } from "..";
import { queues } from "../commands/skip";
import { DiscordEvent } from "../types/DiscordEvent";
import { Queue } from "../types/Queue";

export const event: DiscordEvent = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(chalk.bgCyan.bold(`${client.user?.username} online!`));
    bot.guilds.cache.map((g) => queues.set(g.id, new Queue()));
  },
};
