import {Root as TwitchStatus} from "../types/statuses/twitch";
import {wrapRedis} from "../redis";
import fetch from "node-fetch";

export class ThirdPartyStatuses {
  public static discord() {
    return wrapRedis(
      "discord:status",
      async () => {
        const url = "https://srhpyqt94yxb.statuspage.io/api/v2/summary.json";
        const body = (await fetch(url).then(res => res.json())) as TwitchStatus;

        const statuses = body.components.map(component => {
          return [component.name, component.status === "operational"] as const;
        });

        return statuses;
      },
      60
    );
  }

  public static twitch() {
    return wrapRedis(
      "twitch:status",
      async () => {
        const url = "https://yfj40zdsk34s.statuspage.io/api/v2/summary.json";
        const body = (await fetch(url).then(res => res.json())) as TwitchStatus;

        const statuses = body.components.map(component => {
          return [component.name, component.status === "operational"] as const;
        });

        return statuses;
      },
      60
    );
  }
}
