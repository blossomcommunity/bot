import {MessageEmbed, MessageEmbedOptions, User} from "discord.js";

export class StandardEmbed extends MessageEmbed {
	constructor(user: User, data?: StandardEmbed | MessageEmbedOptions) {
		super(data);

		this.setTimestamp()
			.setColor("#F3B2E5")
			.setFooter("🌸 Blossom")
			.setAuthor(
				user.tag,
				user.avatarURL() || "https://cdn.discordapp.com/embed/avatars/0.png"
			);
	}
}
