import { prisma } from "../prisma";
import { wrapRedis } from "../redis";
import { ALLOWED_PLATFORMS } from "../structs/profile-platforms";
import { StandardEmbed } from "../structs/standard-embed";
import { Command } from "../types/command";

export const profile: Command = {
  inhibitors: [],
  description: "Fetch somebody else's bio",
  syntax: "[user]",
  async run(message, [mention = null]) {
    const id = message.mentions.members?.first()?.id || mention || message.author.id;

    const user = await message.client.users.fetch(id);

    const userProfile = await wrapRedis(`profile:${id}`, () => {
      return prisma.profile.findFirst({
        where: {
          discord_id: id,
        },
      });
    });

    if (!userProfile) {
      throw new Error(
        `${id === message.author.id ? "You do" : "This user does"} not have a profile`
      );
    }

    const embed = new StandardEmbed(user).setDescription(userProfile.bio);

    for (const platform of ALLOWED_PLATFORMS) {
      if (userProfile[platform]) {
        embed.addField(`🌎 ${title(platform)}`, userProfile[platform]);
      }
    }

    await message.channel.send(embed);
  },
};

function title(str: string): string {
  return str.charAt(0).toUpperCase() + str.substr(1);
}
