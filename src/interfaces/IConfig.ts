export interface IConfig {
  name: string;
  token: string;
  clientId: string;
  colour: string;
  log: {
    guildId: string;
    channelId: string;
  };
  roles: {
    [key: string]: string;
  };
  capmonster: {
    key: string;
  };
}
