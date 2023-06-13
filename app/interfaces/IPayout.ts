export interface IPayout {
    _id: string;
    user: string;
    subject: string;
    subjectRef: string;
    status?: string;
    reason?: string;
    accountDetailId?: string;
    metadata?: any;
  }
  
  export interface IPayoutInputDTO {
    user: string;
    accountDetailId: string;
    subject: string;
    subjectRef: string;
  }