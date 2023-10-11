import { BotClient } from "./structs/BotClass";
import { Client, GatewayIntentBits } from "discord.js";
import * as Server from './server/express'; Server;

export const sharedClient = new BotClient(
  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  })
); 

export const allSockets = new Map<string, any>();


