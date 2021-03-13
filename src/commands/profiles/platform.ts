import {prisma} from "../../prisma";
import {redis, wrapRedis} from "../../redis";
import {StandardEmbed} from "../../structs/standard-embed";
import {Command} from "../../types/command";
import * as z from "zod";
import {ALLOWED_PLATFORMS} from "../../structs/profile-platforms";

export const platform: Command = {
  description: "Add a platform to your profile",
  inhibitors: [],
  syntax: "<platform> <url>",
  aliases: ["platform"],
  async run(message, args) {
    const platform = args[0].toLowerCase();
    const [, url] = args;

    if (!ALLOWED_PLATFORMS.includes(platform as "tiktok")) {
      throw new Error(
        `Invalid platform! You must choose one of the following: ${ALLOWED_PLATFORMS.join(", ")}`
      );
    }

    if (!url) {
      throw new Error("No URL provided");
    }

    const isValidURL = z.string().url().safeParse(url).success;
    if (!isValidURL) {
      throw new Error("Invalid URL given");
    }

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
      where: {
        discord_id: message.author.id,
      },
      data: {
        [platform]: url,
      },
    });

    await redis.del(`profile:${message.author.id}`);

    await message.reply(new StandardEmbed(message.author).setDescription("**Saved** ✅"));
  },
};
