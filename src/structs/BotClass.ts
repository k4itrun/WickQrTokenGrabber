import {
  Client,
  Collection,
  REST,
  Routes,
  Guild,
  Emoji,
  Channel,
} from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { config } from "../util/config";
import { IButton, ICommand, IEvent } from "../interfaces/IApplication";

export class BotClient {
  public events = new Collection<string, IEvent>();
  public emojis = new Collection<string, Emoji>();
  public commands = new Collection<string, ICommand>();
  public buttons = new Collection<string, IButton>();
  public guild: Guild | null = null;
  public channel: Channel | null = null;

  constructor(public readonly client: Client) {
    console.log(config);
    this.client.login(config.token);

    this.registerEvents();
    this.registerCommands();
    this.registerButtons();
    this.registerAntiCrash();
  }

  private async registerEvents() {
    const eventFiles = readdirSync(join(__dirname, "..", "events"));

    for (const file of eventFiles) {
      const event = await import(`../events/${file}`);
      this.events.set(event.default.name, event.default);
    }

    this.events.forEach((event) => {
      this.client.on(event.name, event.callback);
    });
  }

  private async registerCommands() {
    const commandFiles = readdirSync(join(__dirname, "..", "commands"));

    for (const file of commandFiles) {
      const command = await import(`../commands/${file}`);
      this.commands.set(command.default.name, command.default);
    }

    const rest = new REST({ version: "10" }).setToken(config.token);

    await rest.put(Routes.applicationCommands(config.clientId), {
      body: this.commands.map((command) => command.data.toJSON()),
    });
  }

  private async registerButtons() {
    const buttonFiles = readdirSync(join(__dirname, "..", "buttons"));

    for (const file of buttonFiles) {
      const button = await import(`../buttons/${file}`);
      this.buttons.set(button.default.id, button.default);
    }
  }

  private async registerAntiCrash() {
    process.on('unhandledRejection', (reason: any, p: Promise<any>) => {
      console.log('\n\n\n\n\n\n [antiCrash] :: Unhandled Rejection/Catch');
      console.log('Reason: ', reason.stack ? String(reason.stack) : String(reason), p);
      console.log(' [antiCrash] :: Unhandled Rejection/Catch \n\n\n\n\n\n');
    });
    
    process.on("uncaughtException", (err: Error, origin: string) => {
      console.log('\n\n\n\n\n\n [antiCrash] :: Uncaught Exception/Catch');
      console.log('Exception: ', err.stack ? err.stack : err, origin);
      console.log(' [antiCrash] :: Uncaught Exception/Catch \n\n\n\n\n\n');
    });
    
    process.on('uncaughtExceptionMonitor', (err: Error, origin: string) => {
      console.log('\n\n\n\n\n\n [antiCrash] :: Uncaught Exception/Catch (MONITOR)');
      console.log(err.stack ? err.stack : err, origin);
      console.log(' [antiCrash] :: Uncaught Exception/Catch (MONITOR) \n\n\n\n\n\n');
    });
  }
}
