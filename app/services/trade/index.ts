import { Service, Inject } from 'typedi';
import { IContractUpdateStatisticsDTO, ITradeInputDTO, ITrade } from '../../interfaces';
import { Document } from 'mongoose';
import { SystemError } from '../../utils';

@Service()
export class TradeService {
  constructor(
    @Inject('tradeModel') private tradeModel: Models.TradeModel,
    @Inject('logger') private logger: { silly(arg0: string): void; error(arg0: unknown): void },
  ) {}

  public async startTrade(contract: ITradeInputDTO): Promise<ITrade> {
    try {
    
      this.logger.silly('starting trade');

      const startedTrade: ITrade & Document = await this.tradeModel.create({
        userId: contract.userId,
        projectId: contract.projectId,
        contractId: contract.contractId,
        type: contract.type,
        status: contract.status,
        amount: contract.amount,
        interest: contract.interest,
        startDate: contract.startDate,
        endDate: contract.endDate,
      });

      return startedTrade;

    } catch(e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async getContract(contractOrProjectId: string): Promise<(IContract & Document) | any> {
    try {
      this.logger.silly('getting contract record');

      const contractRecord : IContract & Document = await this.contractModel
        .find({$or: [
            { 'id': contractOrProjectId },
            { 'projectId': contractOrProjectId },
          ]});
      return contractRecord;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async signContract(contractId: string): Promise<(IContract & Document) | any> {
    try {
      this.logger.silly('sign contract');

      const contractRecord : IContract & Document = await this.contractModel
        .findOne({'id': contractId});

      if(!contractRecord) throw new SystemError(404, `contract with this "contractID: ${contractId}" is not found`);

      return contractRecord;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async updateContractStatistics(data: IContractUpdateStatisticsDTO): Promise<(IContract & Document) | any> {
    try {
      this.logger.silly('updating contract statistics');
      const { contractId, statistics} = data;
      const contractRecord : IContract & Document = await this.contractModel
        .findOne({'id': contractId});
      for (const property in statistics) {
        contractRecord.kpi[property] = contractRecord.kpi[property] + statistics[property];
      }
      await contractRecord.save();
      return contractRecord;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }
}