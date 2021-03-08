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

    if (commandName && args[0]) {
      const command = commands.get(args[0]);

      if (!command) {
        return message.reply(`This command does not exist. Use ${prefix}help to see all commands`);
      }

      const embed = new MessageEmbed().addField("Description", command.description);

      if (command.syntax) {
        embed.addField("Syntax", command.syntax);
      }

      return message.reply(embed);
    }

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
