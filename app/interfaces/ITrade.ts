export interface ITrade {
  _id: string;
  userId: string;
  projectId: string;
  contractId: string;
  type: string;
  status: string;
  amount: Number;
  interest: Number;
  startDate: Date;
  endDate: Date;
  slug: string;
  delete: Boolean;
}

export interface ITradeInputDTO {
  userId: string;
  projectId: string;
  contractId: string;
  type: string;
  status: string;
  amount: Number;
  interest: Number;
  startDate: string;
  endDate: string;
}
