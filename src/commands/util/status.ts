import {Command} from "../../types/command";
import {ThirdPartyStatuses} from "../../structs/third-party-statuses";
import {StandardEmbed} from "../../structs/standard-embed";
import {title} from "../../utils";

const STATUS_PLATFORMS = ["twitch", "discord"];

export const status: Command = {
	description: `Checks server server statuses for: ${STATUS_PLATFORMS.join(", ")}`,
	inhibitors: [],
	syntax: "<platform>",
	aliases: ["status", "s"],
	async run(message, args) {
		const platform = args[0].toLowerCase();

		let components;

		switch (platform) {
			case "twitch":
				components = await ThirdPartyStatuses.twitch();
				break;
			case "discord":
				components = await ThirdPartyStatuses.discord();
				break;
			default:
				throw new Error(`Invalid platform. Please use: ${STATUS_PLATFORMS.join(", ")}.`);
		}

		const allUp = components.every(component => {
			const [, status] = component;
			return status;
		});

		const embed = new StandardEmbed(message.author)
			.setTitle(`${title(platform)} Status`)
			.addFields(
				components.map(component => {
					const [name, status] = component;

					return {
						name,
						value: status ? "Operational ☑️" : "Issues",
						inline: true,
					};
				})
			)
			.setColor(allUp ? "GREEN" : "YELLOW");

		await message.reply(embed);
	},
};
