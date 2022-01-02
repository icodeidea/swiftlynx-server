export interface IAppSetting {
    _id: string;
    referalReward: Number;
    dailySignInReward: Number;
    signupInReward: Number;
  }
  
  export interface IAppSettingInputDTO {
    referalReward?: Number;
    dailySignInReward?: Number;
    signupInReward?: Number;
  }