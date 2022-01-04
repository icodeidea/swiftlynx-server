import { Service, Inject } from 'typedi';
import { IContractUpdateStatisticsDTO, IContractInputDTO, IContract } from '../../interfaces';
import { Document } from 'mongoose';
import { SystemError } from '../../utils';
import { ProjectService } from '../project';

@Service()
export class ContractService {
  constructor(
    @Inject('contractModel') private contractModel: Models.ContractModel,
    @Inject('logger') private logger: { silly(arg0: string): void; error(arg0: unknown): void },
    private project: ProjectService,
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
        type: contract.type,
        interest: contract.interest,
        maturityTime: contract.maturityTime,
        ...amountManager
      });

      await this.project.updateProjectStatistics({
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