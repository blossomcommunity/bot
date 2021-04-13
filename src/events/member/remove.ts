import {GuildMember, PartialGuildMember} from "discord.js";

export async function guildMemberRemove(member: GuildMember | PartialGuildMember): Promise<void> {
  member.client.user?.setPresence({
    status: "online",
    activity: {
      type: "WATCHING",
      name: `over blossom's ${
        member.client.guilds.cache.get(process.env.GUILD_ID!)?.memberCount
      } members!`,
    },
  });
}
