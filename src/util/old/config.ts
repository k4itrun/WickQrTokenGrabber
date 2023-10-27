import "dotenv/config";
import path from "path";
import { IConfig } from "../../interfaces/IConfig";

const CONFIG_PATH = path.resolve(__dirname, "..", "config.json");
let config: IConfig;

try {
  config = require(CONFIG_PATH);
} catch {
  config = {
    name: process.env.NAME || "",
    token: process.env.TOKEN || "",
    clientId: process.env.CLIENT_ID || "",
    colour: process.env.COLOUR || "",
    port: process.env.PORT || "",
    log: {
      guildId: process.env.GUILD_ID || "",
      channelId: process.env.CHANNEL_ID || "",
    },
    roles: {},
    capmonster: {
      key: process.env.CAPMONSTER_APIKEY || "",
    },
  };
}

export const saveRoleConfig = (roles: { [key: string]: string }) => {
  const fs = require("fs");
  config.roles = roles;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
};

export { config };
