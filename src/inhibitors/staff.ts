import { Inhibitor } from "../types/command";
import { guilds } from './guilds'

const staffRole = process.env.STAFF_ROLE_ID;

if (!staffRole) {
  throw new Error('STAFF_ROLE_ID not defined as an envionment variable.');
}

export const staff: Inhibitor = (message) => {
  guilds(message);

  if (!message.member) {
    throw new Error("No member found (try using this command in a server)");
  }

  if (!message.member.roles.cache.get(staffRole)) {
    throw new Error("You must be staff to use this command.");
  }
};
