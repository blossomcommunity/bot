import {guilds} from "../../inhibitors/guilds";
import {StandardEmbed} from "../../structs/standard-embed";
import {Command} from "../../types/command";
import {TextChannel} from "discord.js";

export const suggest: Command = {
  description: "Make a suggestion for Blossom",
  inhibitors: [guilds],
  syntax: "<suggestion>",
  aliases: ["suggest"],
  async run(message, args) {
    if (!args.length) {
      throw new Error("Please include a suggestion!");
    }

    const suggestion = args.join(" ");

    const embed = new StandardEmbed(message.author).setDescription(suggestion);

    const channel = message.client.channels.cache.find(channel => {
      return (channel as TextChannel).name.includes("suggest");
    }) as TextChannel | undefined;

    if (!channel) {
      throw new Error("No suggestions channel found!");
    }

    await channel.send(embed).then(async message => {
      await message.react("<:blossomcheck:818358018488008704>");
      await message.react("<:blossomx:818358018521038929>");
    });

    await message.reply("Suggestion added!");
  },
};
