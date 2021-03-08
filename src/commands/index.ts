import { Command } from "../types/command";

const COMMAND_MAP: Record<string, Command> = {};

export const commands = new Map<string, Command>(Object.entries(COMMAND_MAP));
