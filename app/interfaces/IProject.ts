export interface IProject {
    _id: string;
    userId: string;
    projectName: string;
    projectDescription: string;
    projectBanner: string;
    projectType: string;
    status: string;
    totalFund: Number;
    marketId: string;
    kpi: Array<{
        totalTrade?: Number;
        totalContract?: Number;
        tradeSteak?: Number;
        contractSteak?: Number;
        contractCount?: Number;
      }>;
    slug: string;
    delete: Boolean;
}
  
export interface IProjectInputDTO {
    userId: string;
    projectName: string;
    projectDescription: string;
    projectBanner: string;
    marketId: string;
    projectType: string;
}

export interface IProjectUpdateStatisticsDTO {
    projectId: string;
    statistics: {
        totalTrade?: Number;
        totalContract?: Number;
        tradeSteak?: Number;
        contractSteak?: Number;
        contractCount?: Number;
      };
}
  