export interface ITransaction {
    _id: string;
    user: string;
    subject: string;
    subjectRef: string;
    status?: string;
    reason?: string;
    type: string;
    confirmed?: boolean;
    pending?: boolean;
    confirmations: string;
    fee?: string;
    txid: string;
    from?: string;
    to?: {
      recipient: string;
      amount: number;
    };
  }
  
  export interface ITransactionInputDTO {
    walletId: string;
    amount: number;
    type: string;
    status: string;
    fee?: number;
    subject?: string;
    subjectRef?: string;
    reason?: string;
    from?: string;
    txid?: string;
    recipient?: string;
  }