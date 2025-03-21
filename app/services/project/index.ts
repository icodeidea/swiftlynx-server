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
      console.log('projectId',projectId);

      if(!projectId || projectId === null) return await this.projectModel.find().populate('marketId').sort({createdAt: -1});

      const projectRecord: Array<IProject> = await this.projectModel
        .find({$or: [
            // { '_id': projectId },
            { 'marketId': projectId },
            { 'userId': projectId },
          ]}).populate('marketId').sort({createdAt: -1});
      
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

  public async updateProject(updateProject: IProjectInputDTO): Promise<IProject> {
    try {
    
      this.logger.silly('updating project');
      const userId = updateProject.userId;
      const projectId = updateProject.projectId;
      delete updateProject.userId;
      delete updateProject.projectId;

      const projectRecord = await this.projectModel.findOne({'id': projectId, userId});
      if (!projectRecord) {
        this.logger.silly('project not found');
        throw new SystemError(200, 'project not found');
      }
      for (const property in updateProject) {
        projectRecord[property] = updateProject[property];
      }
      return await projectRecord.save();
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async getFeaturedProjects(): Promise<any> {
    try {
      this.logger.silly('getting my featured projects');
      
      return [
        {
          image: 'https://res.cloudinary.com/diituo7sj/image/upload/v1733965394/swiftlynx-Banner4_qvf9wc.png',
          title: 'wealth',
          description: '',
          link: '',
          location: 'in-app'
        },
        {
          image: 'https://res.cloudinary.com/diituo7sj/image/upload/v1733965394/swiftlynx-Banner2_v3tvgm.png',
          title: 'christmas',
          description: '',
          link: '',
          location: 'in-app'
        },
        {
          image: 'https://res.cloudinary.com/diituo7sj/image/upload/v1733965394/swiftlynx-Banner1_ycu6av.png',
          title: 'salah',
          description: '',
          link: '',
          location: 'web-view'
        },
        {
          image: 'https://res.cloudinary.com/diituo7sj/image/upload/v1733965394/swiftlynx-Banner3_w2yahj.png',
          title: 'new year',
          description: '',
          link: '',
          location: 'in-app'
        },

      ]
    } catch (e) {
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async deleteProject({
    userId,
    projectId
  }: {
    userId: string;
    projectId: string;
  }): Promise<string> {
    this.logger.silly('Deleting Project...');
    try {
      const projectRecord : IProject & Document = await this.projectModel
      .findOne({'id': projectId, userId});

      if(!projectRecord){
        throw new Error('project not found');
      }
      
      const projectDeleted = await this.projectModel.findByIdAndDelete(projectId);
      if(projectDeleted) {
        this.logger.silly('Project deleted!');
        return 'this project is permanently deleted';
      }else{
        throw new Error('this project is unable to delete at the moment, please try again later');
      }
      
    } catch(e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }
}