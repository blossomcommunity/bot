import { Command } from "../types/command";
import { profile } from "./profile";

import { ping } from "./ping";
import { createProfile } from "./create-profile";
import { platform } from "./platform";
import { shoutout } from "./shoutout";
import { editBio } from "./edit-bio";

export const commands = new Map<string, Command>();

commands.set("ping", ping);
commands.set("profile", profile);
commands.set("create-profile", createProfile);
commands.set("edit-bio", editBio);
commands.set("platform", platform);
commands.set("shoutout", shoutout);
