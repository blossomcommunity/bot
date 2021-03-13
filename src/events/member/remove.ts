import {GuildMember, PartialGuildMember, VoiceChannel} from "discord.js";

export async function guildMemberRemove(member: GuildMember | PartialGuildMember) {
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
