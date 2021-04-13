import {Profile} from "@prisma/client";
import {User} from "discord.js";
import {title} from "../utils";
import {ALLOWED_PLATFORMS} from "./profile-platforms";
import {StandardEmbed} from "./standard-embed";

export function profileEmbed(profile: Profile, discordUser: User): StandardEmbed {
	const embed = new StandardEmbed(discordUser).setDescription(profile.bio);

	for (const platform of ALLOWED_PLATFORMS) {
		if (profile[platform]) {
			embed.addField(`🌎 ${title(platform)}`, profile[platform], true);
		}
	}

	return embed;
}
