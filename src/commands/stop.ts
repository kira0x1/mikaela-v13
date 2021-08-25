import { Command } from "../types/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection } from "@discordjs/voice";
export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops current song"),

  execute(interaction) {
    const user = interaction.member?.user;
    const guild = interaction.guild;

    if (!guild) return;
    if (!user) return;

    const connection = getVoiceConnection(guild.id);
    if (!connection) {
      interaction.reply("no song playing");
      return;
    }

    connection.destroy();
    interaction.reply("Destroyed connection");
  },
};
