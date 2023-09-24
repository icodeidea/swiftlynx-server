export interface IUser {
    _id: string;
    email: string;
    refId: string;
    referer: string;
    oneTimeSetup: boolean;
    passwordSet: boolean;
    password: string;
    firstname: string;
    lastname: string;
    username?: string;
    salt: string;
    role?: string;
    deactivated?: boolean;
    tokenVersion?: number;
    country?: string;
    locale?: string;
    picture?: string;
    verified?: {
      token: {
        value: string;
        expires?: number;
      };
      isVerified?: boolean;
    };
    reset?: {
      token?: string;
      expires?: number;
    };
    wallet?: string;
    kpi: {
      usersRefered: Number;
      feedsEarned: Number;
    },
    lastLogin?: Date;
  }
  
  export interface IUserInputDTO {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    referer?: string;
    password: string;
    tokenVersion?: number;
  }

  export interface IUserUpdateDTO {
    username?: string;
    country?: string;
    role?: string;
  }
  