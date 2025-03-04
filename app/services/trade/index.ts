import { Service, Inject } from 'typedi';
import { IContractUpdateStatisticsDTO, ITradeInputDTO, ITradeUpdateDTO, ITrade, IContract } from '../../interfaces';
import { Document, Types } from 'mongoose';
import mongoose from 'mongoose';
import { TransactionService } from '../transaction';
import { SystemError } from '../../utils';
import { getDateOfMonthsFromNow, getDateRange } from "../../utils"

@Service()
export class TradeService {
  constructor(
    @Inject('tradeModel') private tradeModel: Models.TradeModel,
    @Inject('contractModel') private contractModel: Models.ContractModel,
    @Inject('transactionModel') private transactionModel: Models.TransactionModel,
    // private transactor: TransactionService,
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
        duration: contract.duration,
      });

      console.log("startedTrade", startedTrade)
      if(startedTrade){

        //instantiate transaction record keeping
        this.logger.silly('creating transaction.');
        this.transactionModel.create({
          user: contract.userId,
          subject: startedTrade?._id || startedTrade?.id,
          subjectRef: 'Trade',
          type: 'credit',
          txid: Math.floor(100000 + Math.random() * 900000),
          reason: "Supply Liquidity",
          status: 'pending',
          from: null,
          confirmations: true,
          fee: 0,
          metadata: {
            entity: "trade",
            entityId: startedTrade?.id || startedTrade?._id,
          },
          to:
            {
              amount: contract.amount,
              recipient: "swiftlynx"
            },
        });
      }

      return startedTrade;

    } catch(e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async getTradeSummary(userId: string, status: string = 'ACTIVE') : Promise<(ITrade & Document) | any>  {
    try {
      const result = await this.tradeModel.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            status: status,
            deleted: false,
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            totalInterest: { $sum: { $multiply: ['$amount', { $divide: ['$interest', 100] }] } },
            tradeCount: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            totalAmount: 1,
            totalInterest: 1,
            totalAmountWithInterest: { $add: ['$totalAmount', '$totalInterest'] },
            tradeCount: 1,
          },
        },
      ]);
  
      if (result.length > 0) {
        return result[0];
      } else {
        return {
          totalAmount: 0,
          totalInterest: 0,
          totalAmountWithInterest: 0,
          tradeCount: 0,
        };
      }
    } catch (error) {
      console.error('Error fetching trade summary:', error);
      throw error;
    }
  }

  public async getTrades(entityId: string): Promise<(ITrade & Document) | any> {
    try {
      this.logger.silly('getting my trade records');
      const tradeRecords : Array<ITrade> = await this.tradeModel
      .find({'userId': entityId }).populate('contractId', 'contractName').sort({createdAt: -1});

      // get trade summary
      const tradeSum = await this.getTradeSummary(entityId);
      return {
        tradeSum,
        trades: tradeRecords
      };
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

  public async filter(status: string, user?: any): Promise<any> {
    try {
      this.logger.silly('filtering trade record');

      if(Types.ObjectId.isValid(status)){
        const singleTrade = await this.tradeModel.findById(status).populate('userId', ['firstname', 'lastname', 'email', 'picture']);
        if(singleTrade){
          return [].push(singleTrade)
        }
      }

      let params: any = {status}
      if (user) params = {...params, userId: user}

      const tradeRecords = await this.tradeModel.find(params).populate('userId', ['firstname', 'lastname', 'email', 'picture']).sort({createdAt: -1});

      // get trade summary
      const tradeSum = await this.getTradeSummary(params?.userId, params?.status);
      return {
        tradeSum,
        trades: tradeRecords
      };
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
          ]}).sort({createdAt: -1});
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
      if(state === "ACTIVE"){
        const dateRange = getDateRange(parseInt(tradeRecord.duration));
        tradeRecord.startDate = dateRange.startDate;
        tradeRecord.endDate = dateRange.endDate
      }
      
      return await tradeRecord.save();
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }
}