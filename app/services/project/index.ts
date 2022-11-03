import { Service, Inject } from 'typedi';
import { IProjectUpdateStatisticsDTO, IProjectInputDTO, IProject } from '../../interfaces';
import { Document } from 'mongoose';
import { SystemError } from '../../utils';
import { MarketService } from '../market';

@Service()
export class ProjectService {
  constructor(
    @Inject('projectModel') private projectModel: Models.ProjectModel,
    @Inject('logger') private logger: { silly(arg0: string): void; error(arg0: unknown): void },
    private market: MarketService,
  ) {}

  public async startProject(project: IProjectInputDTO): Promise<IProject> {
    try {
    
      this.logger.silly('creating project');
      const createdProject: IProject & Document = await this.projectModel.create({
        userId: project.userId,
        marketId: project.marketId,
        projectName: project.projectName,
        projectDescription: project.projectDescription,
        projectBanner: '',
        projectType: project.projectType,
      });
      await this.market.updateMarketStatistics({
          marketId: project.marketId,
          statistics: {projectCount : 1}
      })
      return createdProject;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async getProject(projectId: string | null | any): Promise<(IProject & Document) | any> {
    try {
      this.logger.silly('getting project record');

      if(!projectId || projectId === null) return await this.projectModel.find();

      const projectRecord: Array<IProject> = await this.projectModel
        .find({$or: [
            { 'id': projectId },
            { 'marketId': projectId },
            { 'userId': projectId },
          ]});
      
      return projectRecord;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async updateProjectStatistics(data: IProjectUpdateStatisticsDTO): Promise<(IProject & Document) | any> {
    try {
      this.logger.silly('updating project statistics');
      const { projectId, statistics} = data;
      const projectRecord : IProject & Document = await this.projectModel
        .findOne({'id': projectId});

      for (const property in statistics) {
        projectRecord[property] = projectRecord[property] + statistics[property];
      }
      await projectRecord.save();
      await this.market.updateMarketStatistics({
          marketId: projectRecord.marketId,
          statistics: {
              ...data.statistics
          }
      });
      
      return projectRecord;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }
}