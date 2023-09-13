export interface ITrade {
  _id: string;
  userId: string;
  projectId: string;
  contractId: string;
  type: string;
  status: string;
  amount: any;
  interest: any;
  startDate: any;
  endDate: any;
  slug: string;
  delete: Boolean;
}

export interface ITradeInputDTO {
  userId: string;
  projectId: any;
  contractId: any;
  tradeId?: string
  type: string;
  status: string;
  amount: any;
  interest: any;
  startDate: any;
  endDate: any;
}

export interface ITradeUpdateDTO {
  userId?: string;
  projectId?: string;
  contractId?: string;
  tradeId?: string
  type?: string;
  status?: string;
  amount?: any;
  interest?: any;
  startDate?: string;
  endDate?: string;
}
