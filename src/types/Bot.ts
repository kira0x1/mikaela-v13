import { Client, Collection } from "discord.js";
import { Command } from "./Command";
import { Queue } from "./Queue";

export class Bot extends Client {
  commands: Collection<string, Command> = new Collection();
}
