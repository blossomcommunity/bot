import {prisma} from "../prisma";
import {wrapRedis} from "../redis";
import {profileEmbed} from "../structs/profile-embed";
import {Command} from "../types/command";

export const profile: Command = {
  inhibitors: [],
  description: "Fetch somebody else's bio",
  syntax: "[user]",
  aliases: ["profile"],
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

    await message.channel.send(profileEmbed(userProfile, user).setTitle("Profile"));
  },
};
