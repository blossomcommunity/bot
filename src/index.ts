import "dotenv/config";

import { Client, EmbedField, MessageEmbed } from "discord.js";
import { commands } from "./commands";
import { prisma } from "./prisma";

const client = new Client();
const prefix = "!";

client.on("ready", () => {
  console.log(`Ready as ${client.user?.tag}`);
});

client.on("message", async (message) => {
  if (message.content.startsWith(prefix)) {
    const [caselessCommandName, ...args] = message.content.replace(prefix, "").split(" ");

    const commandName = caselessCommandName.toLowerCase();

    if (commandName === "help") {
      const entries = [...commands.entries()];

      const fields: EmbedField[] = entries.map((entry) => {
        const [name, command] = entry;
        return {
          name: `${prefix}${name}`,
          value: command.description,
          inline: false,
        };
      });

      const embed = new MessageEmbed().addFields(fields);

      return message.reply(embed);
    }

    const command = commands.get(commandName);

    if (!command) {
      return message.reply("That command does not exist.");
    }

    const inhibitors = Array.isArray(command.inhibitors)
      ? command.inhibitors
      : [command.inhibitors];

    try {
      for (const inhibitor of inhibitors) {
        inhibitor(message);
      }

      await command.run(message, args);
    } catch (e) {
      await message.reply(`⚠ ${e.message}`);
    }
  }
});

prisma.$connect().then(() => client.login(process.env.DISCORD_TOKEN));
