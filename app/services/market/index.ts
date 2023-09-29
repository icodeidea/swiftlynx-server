import { Service, Inject } from 'typedi';
import { IMarketUpdateStatisticsDTO, IMarketInputDTO, IMarket } from '../../interfaces';
import { Document } from 'mongoose';
import { SystemError } from '../../utils';

@Service()
export class MarketService {
  constructor(
    @Inject('marketModel') private marketModel: Models.MarketModel,
    @Inject('logger') private logger: { silly(arg0: string): void; error(arg0: unknown): void },
  ) {}

  public async addMarket(market: IMarketInputDTO): Promise<IMarket> {
    try {
      const marketExists = await this.marketModel.findOne({ marketName: market.marketName });
      if (marketExists) throw new SystemError(200, 'market already existing');
      this.logger.silly('creating market');
      const createdMarket: IMarket & Document = await this.marketModel.create({
        marketName: market.marketName,
        sectorAvailable: market.sectorAvailable,
      });
      return createdMarket;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async getMarket(MarketId: string | null | any): Promise<(IMarket & Document) | any> {
    try {
      this.logger.silly('getting market record');

      if(!MarketId || MarketId === null) return await this.marketModel.find().sort({createdAt: -1});

      const marketRecord : IMarket & Document = await this.marketModel
        .findOne({$or: [
            { 'id': MarketId },
            { 'marketName': MarketId },
          ]});
      return marketRecord;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async updateMarketStatistics(data: IMarketUpdateStatisticsDTO): Promise<(IMarket & Document) | any> {
    try {
      this.logger.silly('updating market statistics');
      const { marketId, statistics} = data;
      const marketRecord : IMarket & Document = await this.marketModel
        .findOne({'id': marketId});
      for (const property in statistics) {
        marketRecord.kpi[property] = marketRecord.kpi[property] + statistics[property];
      }
      return await marketRecord.save();
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }
}