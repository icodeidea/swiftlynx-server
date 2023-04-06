export interface IContract {
    _id: string;
    userId: string;
    projectId: string;
    contractName: string;
    description: string;
    type: string
    status: string;
    fixedAmount: Number;
    minAmount: Number;
    maxAmount: Number;
    interest: Number;
    startDate: Date;
    endDate: Date;
    maturityTime: string;
    kpi: Array<{
      signedCount: Number;
    }>;
    slug: string;
    delete: Boolean;
  }
  
  export interface IContractInputDTO {
    userId: string;
    projectId: string;
    contractId?: string;
    contractName: string;
    description?: string;
    fixedAmount?: Number;
    minAmount?: Number;
    maxAmount?: Number;
    type: string;
    interest: Number;
    maturityTime: string;
  }

  export interface IContractUpdateStatisticsDTO {
    contractId: string;
    statistics: {
        signedCount?: Number;
    };
  }
  