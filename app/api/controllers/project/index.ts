import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import { ProjectService } from '../../../services';
import { IProject, IProjectInputDTO } from '../../../interfaces/';

export class ProjectController {

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static startProject = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling start project endpoint');
    try {
      req.body.userId = req.currentUser.id;
      const projectServiceInstance = Container.get(ProjectService);
      const data = await projectServiceInstance.startProject(req.body as IProjectInputDTO);
      return res.status(201).json({ success: true, data, message: 'project started successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static getProject = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling get project endpoint');
    try {
      const projectId = req.query.projectName || null;
      const projectServiceInstance = Container.get(ProjectService);
      const data = await projectServiceInstance.getProject(projectId);
      return res.status(201).json({ success: true, data, message: 'project retrived successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };


}
