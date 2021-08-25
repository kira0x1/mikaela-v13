import { SlashCommandBuilder } from "@discordjs/builders";
import {
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { Snowflake } from "discord-api-types";
import { Command } from "../types/Command";
import { MusicSubscription } from "../types/MusicSubscription";
import { Track } from "../types/Track";

export const subscriptions = new Map<Snowflake, MusicSubscription>();

let isPlaying = false;

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("play a song from youtube")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Enter a youtube url")
        .setRequired(true)
    ),

  async execute(interaction) {
    interaction.deferReply();

    const guild = interaction.guild;
    const user = interaction.member?.user;
    if (!guild || !user) return;
    let subscription = subscriptions.get(guild.id);

    // await interaction.defer();
    // Extract the video URL from the command
    const url = interaction.options.get("url")!.value! as string;

    // If a connection to the guild doesn't already exist and the user is in a voice channel, join that channel
    // and create a subscription.
    if (!subscription) {
      const member = guild.members.cache.get(user.id);
      if (member && member.voice) {
        const channel = member.voice.channel;
        if (!channel) return;
        subscription = new MusicSubscription(
          joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
          })
        );
        subscription.voiceConnection.on("error", console.warn);
        subscriptions.set(guild.id, subscription);
      }
    }

    // If there is no subscription, tell the user they need to join a channel.
    if (!subscription) {
      await interaction.followUp(
        "Join a voice channel and then try that again!"
      );
      return;
    }

    // Make sure the connection is ready before processing the user's request
    try {
      await entersState(
        subscription.voiceConnection,
        VoiceConnectionStatus.Ready,
        20e3
      );
    } catch (error) {
      console.warn(error);
      await interaction.followUp(
        "Failed to join voice channel within 20 seconds, please try again later!"
      );
      return;
    }

    try {
      // Attempt to create a Track from the user's video URL
      const track = await Track.from(url, {
        onStart() {
          interaction
            .followUp({ content: "Now playing!", ephemeral: true })
            .catch(console.warn);
        },
        onFinish() {
          interaction
            .followUp({ content: "Now finished!", ephemeral: true })
            .catch(console.warn);
        },
        onError(error) {
          console.warn(error);
          interaction
            .followUp({ content: `Error: ${error.message}`, ephemeral: true })
            .catch(console.warn);
        },
      });
      // Enqueue the track and reply a success message to the user
      subscription.enqueue(track);
      await interaction.followUp(`Enqueued **${track.title}**`);
    } catch (error) {
      console.warn(error);
      await interaction.reply("Failed to play track, please try again later!");
    }
  },
};
