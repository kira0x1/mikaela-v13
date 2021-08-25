import { ClientEvents, Client } from "discord.js";

export interface DiscordEvent {
  name: keyof ClientEvents;
  once: boolean;
  execute(client: Client): void;
}
