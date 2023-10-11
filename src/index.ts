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


process.on('unhandledRejection', (reason: any, p: Promise<any>) => {
  console.log(' [antiCrash] :: Unhandled Rejection/Catch');
  console.log(reason, p);
});

process.on("uncaughtException", (err: Error, origin: string) => {
  console.log(' [antiCrash] :: Uncaught Exception/Catch');
  console.log(err, origin);
});

process.on('uncaughtExceptionMonitor', (err: Error, origin: string) => {
  console.log(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)');
  console.log(err, origin);
});
