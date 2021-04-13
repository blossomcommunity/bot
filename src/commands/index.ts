import {Command} from "../types/command";
import {profile} from "./profiles/profile";

import {ping} from "./util/ping";
import {createProfile} from "./profiles/create";
import {platform} from "./profiles/platform";
import {shoutout} from "./profiles/shoutout";
import {editBio} from "./profiles/edit-bio";
import {suggest} from "./suggestions/suggest";
import {acceptSuggestion} from "./suggestions/accept";
import {denySuggestion} from "./suggestions/deny";
import {status} from "./util/status";
import {ambassador} from "./util/ambassador";

import signale from "signale";

export const commands = new Set<Command>();

commands.add(ping);
commands.add(profile);
commands.add(createProfile);
commands.add(editBio);
commands.add(platform);
commands.add(shoutout);
commands.add(suggest);
commands.add(acceptSuggestion);
commands.add(denySuggestion);
commands.add(status);
commands.add(ambassador);

export const commandsWithAliases = new Map(
	Object.entries(
		[...commands.values()].reduce((all, command) => {
			const commandNames = [...new Set(command.aliases)];

			return commandNames.reduce(
				(previous, commandName) => {
					return {
						...previous,
						[commandName]: command,
					};
				},
				{...all}
			);
		}, {} as Record<string, Command>)
	)
);

const commandNames = [...commands.values()].map(c => c.aliases).flat();

const duplicateAliases = commandNames.filter((c, i, a) => a.indexOf(c) !== i);

if (duplicateAliases.length > 0) {
	throw new Error(`Encountered duplicate aliases: ${duplicateAliases.join(", ")}`);
}

signale.info(
	"Registered commands:",
	[...commands.values()]
		.map(c => c.aliases)
		.flat()
		.join(", ")
);
