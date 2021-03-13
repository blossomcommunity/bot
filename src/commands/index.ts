import {Command} from "../types/command";
import {profile} from "./profile";

import {ping} from "./ping";
import {createProfile} from "./create-profile";
import {platform} from "./platform";
import {shoutout} from "./shoutout";
import {editBio} from "./edit-bio";
import {suggest} from "./suggest";
import {acceptSuggestion} from "./accept-suggestion";
import {denySuggestion} from "./deny-suggestion";
import {status} from "./status";

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

signale.info(
  "Registered commands:",
  [...commands.values()]
    .map(c => c.aliases)
    .flat()
    .join(", ")
);
