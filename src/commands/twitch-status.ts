import { guilds } from "../inhibitors/guilds";
import { Command } from "../types/command";
import { ThirdPartyStatuses } from "../structs/third-party-statuses";
import { StandardEmbed } from "../structs/standard-embed";

export const twitchStatus: Command = {
  description: "",
  inhibitors: [],
  syntax: "<message>",
  async run(message) {
    const components = await ThirdPartyStatuses.twitch();

    const allUp = components.every((component) => {
      const [, status] = component;
      return status;
    });

    const embed = new StandardEmbed(message.author).setTitle("Twitch Status").addFields(
      components.map((component) => {
        const [name, status] = component;

        return {
          name,
          value: status ? "Operational ☑️" : "Issues",
          inline: true,
        };
      })
    );

    if (allUp) {
      embed.setColor("GREEN");
    } else {
      embed.setColor("YELLOW");
    }

    await message.reply(embed);
  },
};
