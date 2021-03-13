import "dotenv/config";

import {Client, EmbedField} from "discord.js";
import {commands, commandsWithAliases} from "./commands";
import {prisma} from "./prisma";
import {StandardEmbed} from "./structs/standard-embed";
import signale from "signale";
import {guildMemberAdd} from "./events/member/add";
import {guildMemberRemove} from "./events/member/remove";

const client = new Client();
const prefix = process.env.PREFIX || "b!";

client.on("ready", () => {
  signale.success(`Ready as ${client.user?.tag}`);
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const [caselessCommandName, ...args] = message.content.replace(prefix, "").split(" ");
  const commandName = caselessCommandName.toLowerCase();

  if (commandName === "help" && args[0]) {
    const command = commandsWithAliases.get(args[0]);

    if (!command) {
      return message.reply(`This command does not exist. Use ${prefix}help to see all commands`);
    }

    const embed = new StandardEmbed(message.author).addField("Description", command.description);

    if (command.syntax) {
      embed.addField("Syntax", `\`${prefix}${args[0]} ${command.syntax}\``);
    }

    if (command.aliases) {
      embed.addField("Aliases", command.aliases.map(a => `\`${a}\``).join(", "));
    }

    return message.reply(embed);
  }

  if (commandName === "help") {
    const entries = [...commands.values()];

    const fields: EmbedField[] = entries.map(command => {
      const name = command.aliases[0];

      return {
        name: prefix + name,
        value: command.description,
        inline: false,
      };
    });

    const embed = new StandardEmbed(message.author).addFields(fields);

    return message.reply(embed);
  }

  const command = commandsWithAliases.get(commandName);

  if (!command) {
    return message.reply("That command does not exist.");
  }

  const inhibitors = Array.isArray(command.inhibitors) ? command.inhibitors : [command.inhibitors];

  try {
    for (const inhibitor of inhibitors) {
      inhibitor(message);
    }

    await command.run(message, args);
  } catch (e) {
    await message.reply(`⚠ ${e.message}`);
  }
});

client.on("guildMemberAdd", async member => {
  guildMemberAdd(member);
});

client.on("guildMemberRemove", async member => {
  guildMemberRemove(member);
});

prisma.$connect().then(() => client.login(process.env.DISCORD_TOKEN));
