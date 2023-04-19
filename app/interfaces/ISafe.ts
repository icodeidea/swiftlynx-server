export interface ISafe {
    _id: string;
    user: string;
    amountRaised: number;
    goal: number;
    status: string;
    active: boolean;
    remark: string;
  }
  
  export interface ISafeInputDTO {
    goal: Number;
    status?: string;
    active?: boolean;
    remark: string;
  }
  