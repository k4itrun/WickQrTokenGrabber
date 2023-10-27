import { ActivityType, ClientUser, Guild, TextChannel } from "discord.js";
import { sharedClient } from "..";
import { config } from "../util/config";

export default {
  name: "ready",
  callback: async () => {
    try {
      const botUsername = sharedClient.client.user?.username;
      if (botUsername) {
        console.log(`${botUsername} is ready!`);
        setBotActivity(sharedClient.client.user, "wickbot.com | Verifying Members");
      } else {
        console.error("Bot username is undefined.");
      }

      const guild = await getGuild(config.log.guildId);
      const channel = await getChannel(guild, config.log.channelId);

      sharedClient.guild = guild;
      sharedClient.channel = channel;
    } catch (error) {
      console.error("An error occurred in the ready event:", error);
    }
  },
};

async function setBotActivity(botUser: ClientUser | null, activityText: string) {
  if (botUser) {
    botUser.setActivity(activityText, { type: ActivityType.Competing });
  }
}

async function getGuild(guildId: string): Promise<Guild> {
  return sharedClient.client.guilds.fetch(guildId);
}

async function getChannel(guild: Guild, channelId: string): Promise<TextChannel> {
  return guild.channels.fetch(channelId) as Promise<TextChannel>;
}
