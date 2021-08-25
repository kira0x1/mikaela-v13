import { SlashCommandBuilder } from "@discordjs/builders";
import { createAudioPlayer } from "@discordjs/voice";
import { Collection } from "discord.js";
import { Command } from "../types/Command";
import { Queue } from "../types/Queue";

export const queues: Collection<string, Queue> = new Collection();

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the currently playing song"),

  async execute(interaction) {
    const guild = interaction.guild;
    if (!guild) return;

    const player = createAudioPlayer();
    const queue = queues.get(guild.id);
    if (!queue) return;

    const resource = queue.getNextResource();
    if (resource) player.play(resource);
  },
};
