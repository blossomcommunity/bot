import { Message } from "discord.js";

export interface Command {
  description: string;
  inhibitors: Inhibitor[] | Inhibitor;
  syntax?: string;
  run(message: Message, args: string[]): Promise<void>;
}

export type Inhibitor = (message: Message) => void;
