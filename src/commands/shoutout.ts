import { prisma } from "../prisma";
import { profileEmbed } from "../structs/profile-embed";
import { ALLOWED_PLATFORMS } from "../structs/profile-platforms";
import { StandardEmbed } from "../structs/standard-embed";
import { Command } from "../types/command";
import { title } from "../utils";

export const shoutout: Command = {
  description: "Find a random profile for a shoutout!",
  inhibitors: [],
  async run(message) {
    const count = await prisma.profile.count();

    const profile = await prisma.profile.findFirst({
      skip: Math.floor(Math.random() * count),
    });

    if (!profile) {
      throw new Error("No users found");
    }

    const user = await message.client.users.fetch(profile.discord_id);

    await message.channel.send(profileEmbed(profile, user).setTitle("Shoutout!"));
  },
};
