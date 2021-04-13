import {GuildMember, MessageEmbed} from "discord.js";

export async function guildMemberAdd(member: GuildMember): Promise<void> {
  member.client.user?.setPresence({
    status: "online",
    activity: {
      type: "WATCHING",
      name: `over blossom's ${
        member.client.guilds.cache.get(process.env.GUILD_ID!)?.memberCount
      } members!`,
    },
  });

  const welcome = new MessageEmbed()
    .setAuthor(
      `Welcome to blossom, ${member.displayName}`,
      "https://media.discordapp.net/attachments/805543885111558145/818351244921536522/9686a1fd8deeedd75c32de52f97d923c.png"
    )
    .setColor("#ffaee8")
    .setDescription(
      "Hey there! Glad to have you in blossom! To gain access to the server, you'll need to answer the questions in <#807648209521475635>. To do that, just click the corresponding emoji for whatever roles you need, then click the flower icon to agree to the rules. See you in the server!"
    );

  const tutorial = new MessageEmbed()
    .setAuthor(
      "Guide on how to get roles in blossom",
      "https://cdn.discordapp.com/emojis/808086733529940048.png?v=1"
    )
    .setColor("#ffaee8")
    .setImage(
      "https://cdn.discordapp.com/attachments/805543885111558145/818353107376799754/CleanShot_2021-03-08_at_00.22.34.gif"
    );

  await member.send(welcome);
  await member.send(tutorial);
}
