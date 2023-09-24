import { Service, Inject } from 'typedi';
import { IFit, IFitInputDTO, IFitUpdateDTO } from '../../interfaces/IFit';
import { Document } from 'mongoose';
import { SystemError } from '../../utils';

@Service()
export class FitService {
  constructor(
    @Inject('fitModel') private fitModel: Models.FitModel,
    @Inject('logger') private logger: { silly(arg0: string): void; error(arg0: unknown): void },
  ) {}

  public async saveFit(fit: IFitInputDTO): Promise<IFit> {
    try {
    
      this.logger.silly('creating fit');

      const createdFit: IFit & Document = await this.fitModel.create({
        ...fit
      });

      return createdFit;

    } catch(e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async filter(status: string, branch: string): Promise<any> {
    try {
      this.logger.silly('filtering fit record');
      let params: any = {status};
      if(branch) params = { ...params, branch}

      return await this.fitModel.find({...params});
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async updateFitStatus({fitId, state}:{fitId: string, state: string}): Promise<IFit> {
    try {
    
      this.logger.silly('updating fit');

      const fitRecord = await this.fitModel.findById(fitId); 
      if (!fitRecord) {
        this.logger.silly('fit not found');
        throw new SystemError(200, 'fit not found');
      }
      
      fitRecord.status = state;
      
      return await fitRecord.save();
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }
}