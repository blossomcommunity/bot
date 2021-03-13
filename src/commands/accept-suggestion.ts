import { staff } from "../inhibitors";
import { guilds } from "../inhibitors/guilds";
import { Command } from "../types/command";
import { TextChannel, MessageEmbed } from "discord.js";

export const acceptSuggestion: Command = {
  description: `Accept suggestion. Requires <@&${process.env.STAFF_ROLE_ID}>.`,
  inhibitors: [guilds, staff],
  syntax: "<ID> <message>",
  aliases: ["accept", "as"],
  async run(message, args) {
    const [suggestionId, ...rest] = args;

    const channel = message.client.channels.cache.find(channel => {
      return (channel as TextChannel).name.includes("suggest");
    }) as TextChannel | undefined;

    if (!channel) {
      throw new Error("No suggestions channel found!");
    }

    const suggestion = await channel.messages.fetch(suggestionId);

    if (!suggestion) {
      throw new Error("Suggestion not found");
    }

    const clonedEmbed = new MessageEmbed(suggestion.embeds[0])
      .addField(`Approved by ${message.author.tag}`, rest.join(" "))
      .setColor("#77dd77");

    await suggestion.edit(clonedEmbed);
  },
};
