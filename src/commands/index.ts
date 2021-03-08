import { Command } from "../types/command";
import { profile } from "./profile";

import { ping } from "./ping";
import { createProfile } from "./create-profile";

export const commands = new Map<string, Command>();

commands.set("ping", ping);
commands.set("profile", profile);
commands.set("create-profile", createProfile);
