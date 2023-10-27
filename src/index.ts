import { BotClient } from "./structs/BotClass";
import { Client, GatewayIntentBits } from "discord.js";
import './server/express';

const sharedClient = new BotClient(
  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  })
);

const allSockets = new Map<string, any>();

export { sharedClient, allSockets };
