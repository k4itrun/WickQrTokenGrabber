import { Console } from "console";
import { ActivityType } from "discord.js";
import { sharedClient } from "..";
import { config } from "../util/config";

export default {
  name: "ready",
  callback: async () => {
    try {
      console.log(sharedClient.client.user?.username + " is ready!");
      sharedClient.client.user?.setActivity("wickbot.com | Verifying Members", {
        type: ActivityType.Competing,
      });

      const guild = await sharedClient.client.guilds.fetch(config.log.guildId);
      const channel = await guild.channels.fetch(config.log.channelId);

      sharedClient.guild = guild;
      sharedClient.channel = channel;

      sharedClient.client.on("ready", async () => {
        console.log(`Anticrashing in ${sharedClient.client.user?.username}`);
        process.on('unhandledRejection', (reason: any, p: Promise<any>) => {
          console.log('\n\n\n\n\n=== [unhandled Rejection] ==='.toUpperCase());
          console.log(reason.stack ? String(reason.stack) : String(reason));
          console.log('=== unhandled Rejection ===\n\n\n\n\n'.toUpperCase());
        });
        process.on("uncaughtException", (err: Error, origin: NodeJS.UncaughtExceptionOrigin) => {
          console.log('\n\n\n\n\n\n=== [uncaught Exception] ==='.toUpperCase());
          console.log(err.stack ? err.stack : err)
          console.log('=== uncaught Exception ===\n\n\n\n\n'.toUpperCase());
        })
        process.on('uncaughtExceptionMonitor', (err: Error, origin: NodeJS.UncaughtExceptionOrigin) => {
          console.log('=== [uncaught Exception Monitor] ==='.toUpperCase());
        });
        process.on('exit', (code: number) => {
          console.log('\n\n\n\n\n=== [exit] ==='.toUpperCase());
          console.log(code.toString());
          console.log('=== exit ===\n\n\n\n\n'.toUpperCase());
        });
        process.on('multipleResolves', (type: string, promise: Promise<any>, reason: any) => {
          console.log('\n\n\n\n\n=== [multiple Resolves] ==='.toUpperCase());
          console.log(type, promise, reason);
          console.log('=== multiple Resolves ===\n\n\n\n\n'.toUpperCase());
        });
      });
    } catch (error) {
      console.error("An error occurred in the ready event:", error);
    }
  },
};
