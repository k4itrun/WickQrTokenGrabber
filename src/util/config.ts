import "dotenv/config";
import path from "path";
import { IConfig } from "../interfaces/IConfig";
import fs from "fs";

const CONFIG_PATH = path.resolve(__dirname, "..", "config.json");

const defaultConfig: IConfig = {
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

let config: IConfig;

try {
  config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
} catch (error) {
  config = defaultConfig;
}

export const saveRoleConfig = (roles: { [key: string]: string }) => {
  config.roles = roles;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
};

export { config };
