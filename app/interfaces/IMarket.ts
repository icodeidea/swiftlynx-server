export interface IMarket {
    _id: string;
    marketName: string
    status: string;
    sectorAvailable: string;
    kpi: Array<{
        totalTrade: Number;
        totalContract?: Number;
        tradeSteak: Number;
        contractSteak?: Number;
        projectCount?: Number;
      }>;
    slug: string;
    delete: Boolean;
}
  
export interface IMarketInputDTO {
    marketName: string;
    sectorAvailable: string;
}

export interface IMarketUpdateStatisticsDTO {
    marketId: string;
    statistics: {
        totalTrade?: Number;
        totalContract?: Number;
        tradeSteak?: Number;
        contractSteak?: Number;
        projectCount?: Number;
      };
}
  