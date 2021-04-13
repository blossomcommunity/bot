import "dotenv/config";

import {Client} from "discord.js";
import {commands, commandsWithAliases} from "./commands";
import {prisma} from "./prisma";
import {StandardEmbed} from "./structs/standard-embed";
import signale from "signale";
import {guildMemberAdd} from "./events/member/add";
import {guildMemberRemove} from "./events/member/remove";
import {staff} from "./inhibitors";

const client = new Client();
const prefix = process.env.PREFIX || "b!";
const staffRole = process.env.STAFF_ROLE_ID;

client.on("ready", () => {
  signale.success(`Ready as ${client.user?.tag}`);
  client.user?.setPresence({
    status: "online",
    activity: {
      type: "WATCHING",
      name: `over blossom's ${
        client.guilds.cache.get(process.env.GUILD_ID!)?.memberCount
      } members!`,
    },
  });
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

    const fields = entries
      .filter(x => {
        const inhibitors = Array.isArray(x.inhibitors) ? x.inhibitors : [x.inhibitors];
        if (inhibitors.includes(staff) && message.member?.roles.cache.get(staffRole as string)) {
          return true;
        } else {
          return !x.hideInHelpMenu;
        }
      })
      .map(command => {
        const name = command.aliases[0];

        return `\`${prefix}${name}\`: ${command.description}`;
      });

    const embed = new StandardEmbed(message.author).setDescription(fields.join("\n"));

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

client.on("guildMemberAdd", guildMemberAdd);
client.on("guildMemberRemove", guildMemberRemove);

prisma.$connect().then(() => client.login(process.env.DISCORD_TOKEN));
