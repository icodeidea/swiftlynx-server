export interface IAccountDetail {
    _id: string;
    user: string;
    accountName: string;
    accountNumber: string;
    bankname?: string;
  }
  
  export interface IAccountDetailInputDTO {
    user: string;
    accountName: string;
    accountNumber: string;
    bankname?: string;
  }