import { SlashCommandBuilder } from "@discordjs/builders";

import { Command } from "../types/Command";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
