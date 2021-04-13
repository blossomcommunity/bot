import {guilds} from "../../inhibitors/guilds";
import {Command} from "../../types/command";
import {GraphQLClient, gql} from "graphql-request";
import {StandardEmbed} from "../../structs/standard-embed";
import {array} from "zod";
import {wrapRedis} from "../../redis";
import {prisma} from "../../prisma";
import {Role} from "discord.js";

const ambassadorRoleID = process.env.AMBASSADOR_ROLE_ID;
const gqlCID = process.env.GQL as string;

export const ambassador: Command = {
  description: "Get the Blossom Ambassador role",
  inhibitors: [guilds],
  syntax: "<Twitch username>",
  aliases: ["ambassador"],
  async run(message, [username = null]) {
    const prefix = process.env.PREFIX || "b!";

    if (!username) {
      throw new Error("Missing Twitch username!");
    }

    const ambassadorRole = (await message.guild!.roles.cache.get(
      ambassadorRoleID as string
    )) as Role;

    if ((await message.member?.roles.cache.get(ambassadorRoleID as string)) as Role) {
      throw new Error("you're already an Ambassador!");
    }

    const query = gql`
      query {
        user(login: "${username}") {
          description
          panels {
            __typename
            ... on DefaultPanel {
              linkURL
            }
          }
        }
      }
    `;

    const url = "https://gql.twitch.tv/gql";

    const graphQLClient = new GraphQLClient(url, {
      headers: {
        "Client-ID": `${gqlCID}`,
      },
    });

    const data = await graphQLClient.request(query);
    let found = false;

    if (!data.user) {
      throw new Error("Twitch user not found.");
    }

    if (!data.user.panels) {
      throw new Error("no panels found found.");
    }

    for (const panel in data.user.panels) {
      if (data.user.panels[panel]["linkURL"]) {
        if (data.user.panels[panel]["linkURL"].includes("QMQ3jwGYz3")) {
          found = true;
          const userProfile = await wrapRedis(`profile:${message.author.id}`, () => {
            return prisma.profile.findFirst({
              where: {
                discord_id: message.author.id,
              },
            });
          });

          if (!userProfile) {
            await prisma.profile.create({
              data: {
                discord_id: message.author.id,
                bio: data.user.description,
                twitch: username,
              },
            });
          }

          await message.member?.roles.add(ambassadorRole);

          await message.reply(
            new StandardEmbed(message.author)
              .setTitle("Welcome to the Blossom Ambassadors!")
              .setDescription(
                `You now have the <@&814190401291943987> role - you'll now show up on our sidebar when you're streaming & you're now an important part of the growth of Blossom Community <:blossomSalute:816806590530453526>\n\nWe've also created a profile for you - you can view your profile at any time with \`${prefix}profile\`.`
              )
          );
        }
      }
    }
    if (!found) {
      const embed = new StandardEmbed(message.author).setDescription(
        "We couldn't find a panel with the Discord URL `discord.gg/QMQ3jwGYz3` - make sure you've added the correct URL. If you think this is a mistake, contact a staff member!"
      );
      await message.reply(embed);
    }
  },
};
