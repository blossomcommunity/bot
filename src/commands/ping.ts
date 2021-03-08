import { Command } from "../types/command";

export const ping: Command = {
  description: "Check that the bot is online",
  inhibitors: [],
  async run(message, args) {
    await message.reply(args.join(" "));
  },
};
