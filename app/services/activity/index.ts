import { Service, Inject } from 'typedi';
import { IActivity, IActivityInputDTO } from '../../interfaces';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/eventDispatcher';
import events from '../../subscribers/events';
import { SystemError } from '../../utils';
import { Document } from 'mongoose';

@Service()
export class ActivityService {
  constructor(
    @Inject('activityModel') private activityModel: Models.ActivityModel,
    @Inject('logger') private logger: { silly(arg0: string): void; error(arg0: unknown): void },
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async addActivity(activityInputDTO: IActivityInputDTO): Promise<{} | String> {
    try {

      const activityRecord = await this.activityModel.create({
        ...activityInputDTO
      });

      return 'activity added';
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async recentActivity(): Promise<{} | String> {
    try {

      return await this.activityModel.find().populate('User', 'username picture').sort('createdAt');

    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async Delete({
    activityId,
  }: {
    activityId: string;
  }): Promise<string> {
    this.logger.silly('Deleting Activity...');

    
    try {
      const activityDeleted = await this.activityModel.findByIdAndDelete(activityId);
      if(activityDeleted) {
        this.logger.silly('Activity deleted!');
        return 'activity  deleted';
      }else{
        throw new Error('this activity is unable to delete at the moment, please try again later');
      }
      
    } catch(e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }
}
