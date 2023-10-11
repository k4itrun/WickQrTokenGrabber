export interface IUserInfo {
  userid: string;
  discriminator: number;
  avatar: string;
  username: string;
}

export interface IFullUserInfo {
  userid: string;
  discriminator: number;
  avatar: string;
  username: string;
  email: string;
  phone: string;
  premium_type: number;
}

export interface IFriend {
  id: string;
  type: number;
  nickname: string;
  user: {
    id: string;
    username: string;
    display_name: string;
    avatar: string;
    avatar_decoration: string;
    discriminator: string;
    public_flags: number;
  };
}
