import { Service, Inject } from 'typedi';
import { IContractUpdateStatisticsDTO, IContractInputDTO, IContract } from '../../interfaces';
import { Document } from 'mongoose';
import { SystemError } from '../../utils';
import { ProjectService } from '../project';
import { TradeService } from '../trade';
import { MailerService } from '../mailer';

@Service()
export class ContractService {
  constructor(
    @Inject('contractModel') private contractModel: Models.ContractModel,
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('logger') private logger: { silly(arg0: string): void; error(arg0: unknown): void },
    private mailer: MailerService,
    private project: ProjectService,
    private trade: TradeService
  ) {}

  public async addContract(contract: IContractInputDTO): Promise<IContract> {
    try {
    
      this.logger.silly('adding contract');

      let amountManager = null;
      const projectExist = this.project.getProject(contract.projectId);

      if(!projectExist) {throw new SystemError(400, `project with this "projectID" is not found`);}

      if(contract.fixedAmount){

        if(contract.fixedAmount < 1000) {throw new SystemError(400, 'amount should be up to 1000');}

        amountManager = {
            fixedAmount: contract.fixedAmount
        };
      }

      if(contract.minAmount && contract.maxAmount){
        if(contract.minAmount < 1000) {throw new SystemError(400, 'minimum amount should be up to 1000');}
        if(contract.maxAmount <= contract.minAmount ) {throw new SystemError(400, 'maximum amount cannot be lower than or equals minimum amount');}
        amountManager = {
            minAmount: contract.minAmount,
            maxAmount: contract.maxAmount,
        };
      }

      if (amountManager === null) {throw new SystemError(400, 'please provide a contract model');}

      const addedContract: IContract & Document = await this.contractModel.create({
        userId: contract.userId,
        projectId: contract.projectId,
        contractName: contract.contractName,
        description: contract.description,
        type: contract.type,
        interest: contract.interest,
        maturityTime: contract.maturityTime,
        ...amountManager
      });

      this.project.updateProjectStatistics({
          projectId: contract.projectId,
          statistics: {
            totalContract: 1
          }
      })

      return addedContract;

    } catch(e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async getContract(contractOrProjectId: string): Promise<(IContract & Document) | any> {
    try {
      this.logger.silly('getting contract record');
      console.log('contractOrProjectId', contractOrProjectId);

      const contractRecord : Array<IContract> = await this.contractModel
      .find({'projectId': contractOrProjectId, state: 'PENDING'});
      //   .find({$or: [
      //       { 'id': contractOrProjectId },
      //       { 'projectId': contractOrProjectId },
      //     ]});
      return contractRecord;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async getAllContract(userId: string): Promise<(IContract & Document) | any> {
    try {
      this.logger.silly('getting all user contract record');

      const contractRecord : Array<IContract> = await this.contractModel
      .find({ 'userId': userId });
      //   .find({$or: [
      //       { 'id': contractOrProjectId },
      //       { 'projectId': contractOrProjectId },
      //     ]});
      return contractRecord;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async signContract(contractId: string, userId: string, amount?: Number): Promise<(IContract & Document) | any> {
    try {
      this.logger.silly('sign contract');

      const contractRecord : IContract & Document = await this.contractModel
        .findOne({'id': contractId});

      if(!contractRecord) throw new SystemError(404, `contract with this "contractId: ${contractId}" is not found`);

      if(contractRecord.minAmount && contractRecord.maxAmount){
        if(contractRecord.minAmount > amount) {throw new SystemError(400, `minimum amount should be up to ${contractRecord.minAmount}`);}
        if(amount > contractRecord.maxAmount) {throw new SystemError(400, `amount cannot be greater than ${contractRecord.maxAmount}`);}
      }

      const tradeRecord = await this.trade.startTrade({
        userId,
        amount: contractRecord.fixedAmount ? contractRecord.fixedAmount : amount,
        projectId: contractRecord.projectId,
        contractId: contractRecord.id,
        type: contractRecord.type,
        status: 'ACTIVE',
        interest: contractRecord.interest,
        startDate: `${Date.now()}`,
        endDate: contractRecord.maturityTime
      })

      this.project.updateProjectStatistics({
        projectId: contractRecord.projectId,
        statistics: {
          totalTrade: 1
        }
      })

      return tradeRecord;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async requestPaymentConfirmation(user: string, entityId: string): Promise<any> {
    try {
      this.logger.silly('requesting payment confirmation');
      const userRecord = await this.userModel.findById(user);
      const contractRecord : IContract & Document = await this.contractModel
        .findOne({ 'id': entityId, userId: user });

      await this.mailer.ConfirmpaymentRequestMail(userRecord, contractRecord);
      return null;
    } catch (e) {
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

  public async updateContract(updateContract: IContractInputDTO): Promise<IContract> {
    try {
    
      this.logger.silly('updating contract');
      const userId = updateContract.userId;
      const contractId = updateContract.contractId;
      delete updateContract.userId;
      delete updateContract.projectId;

      const contractRecord = await this.contractModel.findOne({'id': contractId, userId});
      if (!contractRecord) {
        this.logger.silly('contract not found');
        throw new SystemError(200, 'project not found');
      }
      for (const property in updateContract) {
        contractRecord[property] = updateContract[property];
      }
      return await contractRecord.save();
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async deleteContract({
    userId,
    contractId
  }: {
    userId: string;
    contractId: string;
  }): Promise<string> {
    this.logger.silly('Deleting Contract...');
    try {
      const contractRecord : IContract & Document = await this.contractModel
      .findOne({'id': contractId, userId});

      if(!contractRecord){
        throw new Error('contract not found');
      }
      
      const contractDeleted = await this.contractModel.findByIdAndDelete(contractId);
      if(contractDeleted) {
        this.logger.silly('contract deleted!');
        return 'this contract is permanently deleted';
      }else{
        throw new Error('this contract is unable to delete at the moment, please try again later');
      }
      
    } catch(e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }
}