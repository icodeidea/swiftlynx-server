import { Service, Inject } from 'typedi';
import { IContractUpdateStatisticsDTO, ITradeInputDTO, ITradeUpdateDTO, ITrade, IContract } from '../../interfaces';
import { Document } from 'mongoose';
import { SystemError } from '../../utils';

@Service()
export class TradeService {
  constructor(
    @Inject('tradeModel') private tradeModel: Models.TradeModel,
    @Inject('contractModel') private contractModel: Models.ContractModel,
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

  public async getTrades(entityId: string): Promise<(ITrade & Document) | any> {
    try {
      this.logger.silly('getting my trade records');
      const tradeRecords : Array<ITrade> = await this.tradeModel
      .find({'userId': entityId }).populate('contractId', 'contractName');
    return tradeRecords;
    } catch (e) {
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async activateTrade (tradeId: string, amount: string): Promise<(ITrade & Document) | any> {
    try {
      await this.updateTrade({
        tradeId,
        amount
      })
      return await this.updateTradeStatus({
        tradeId,
        state: 'ACTIVE'
      })
    } catch (error) {
      
    }
  }

  public async filter(status: string): Promise<any> {
    try {
      this.logger.silly('filtering trade record');

      return await this.tradeModel.find({status}).populate('userId', ['firstname', 'lastname', 'email', 'picture']);
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async getContract(contractOrProjectId: string): Promise<(IContract & Document) | any> {
    try {
      this.logger.silly('getting contract record');

      const contractRecord : Array<IContract> = await this.contractModel
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

  public async updateTrade(updateTrade: ITradeUpdateDTO): Promise<ITrade> {
    try {
    
      this.logger.silly('updating trade');
      const userId = updateTrade.userId;
      const tradeId = updateTrade.tradeId;
      delete updateTrade.userId;
      delete updateTrade.projectId;

      const tradeRecord = await this.tradeModel.findOne({'id': tradeId});
      if (!tradeRecord) {
        this.logger.silly('trade not found');
        throw new SystemError(200, 'trade not found');
      }
      for (const property in updateTrade) {
        tradeRecord[property] = updateTrade[property];
      }
      return await tradeRecord.save();
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async updateTradeStatus({tradeId, state}:{tradeId: string, state: string}): Promise<ITrade> {
    try {
    
      this.logger.silly('updating trade');

      const tradeRecord = await this.tradeModel.findById(tradeId); 
      if (!tradeRecord) {
        this.logger.silly('trade not found');
        throw new SystemError(200, 'trade not found');
      }
      
      tradeRecord.status = state;
      
      return await tradeRecord.save();
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }
}