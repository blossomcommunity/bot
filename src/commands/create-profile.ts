import { prisma } from "../prisma";
import { wrapRedis } from "../redis";
import { StandardEmbed } from "../structs/standard-embed";
import { Command } from "../types/command";

export const createProfile: Command = {
  description: "Create a profile",
  inhibitors: [],
  syntax: "<bio>",
  async run(message, args) {
    const bio = args.join(" ");

    const userProfile = await wrapRedis(`profile:${message.author.id}`, () => {
      return prisma.profile.findFirst({
        where: {
          discord_id: message.author.id,
        },
      });
    });

    if (userProfile) {
      throw new Error("You already have a profile.");
    }

    await prisma.profile.create({
      data: {
        discord_id: message.author.id,
        bio,
      },
    });

    await message.reply(new StandardEmbed(message.author).setDescription("**Created** ✅"));
  },
};
