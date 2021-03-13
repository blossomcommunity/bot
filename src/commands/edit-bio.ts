import {prisma} from "../prisma";
import {redis, wrapRedis} from "../redis";
import {StandardEmbed} from "../structs/standard-embed";
import {Command} from "../types/command";

export const editBio: Command = {
  description: "Edit your bio",
  inhibitors: [],
  syntax: "<bio>",
  aliases: ["edit-bio"],
  async run(message, args) {
    const bio = args.join(" ");

    const userProfile = await wrapRedis(`profile:${message.author.id}`, () => {
      return prisma.profile.findFirst({
        where: {
          discord_id: message.author.id,
        },
      });
    });

    if (!userProfile) {
      throw new Error("You do not have a profile.");
    }

    await prisma.profile.update({
      where: {discord_id: message.author.id},
      data: {bio},
    });

    await redis.del(`profile:${message.author.id}`);

    await message.reply(new StandardEmbed(message.author).setDescription("**Updated bio** ✅"));
  },
};
