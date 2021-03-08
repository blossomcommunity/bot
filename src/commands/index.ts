import { Command } from "../types/command";
import { ping } from "./ping";

export const commands = new Map<string, Command>();

commands.set("ping", ping);
