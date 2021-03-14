import {GuildMember, PartialGuildMember, VoiceChannel} from "discord.js";

export async function guildMemberRemove(member: GuildMember | PartialGuildMember) {
  member.client.user?.setPresence({
    status: "online",
    activity: {
      type: "WATCHING",
      name: `over blossom's ${
        member.client.guilds.cache.get("805539092870856704")?.memberCount
      } members!`,
    },
  });
  const channel = member.guild.channels.cache.find(channel => {
    return (channel as VoiceChannel).id === process.env.MEMBER_COUNT_CHANNEL_ID;
  }) as VoiceChannel | undefined;

  if (!channel) {
    throw new Error("No member count channel found!");
  }

  try {
    await channel.setName(`🌸 ${member.guild.memberCount} members`);
  } catch (error) {
    throw new Error(error);
  }
}
