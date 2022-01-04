import { Router } from 'express'
import middlewares, { validator } from '../../middlewares';
import { ProjectController } from '../../controllers'

const { startProject, getProject} = ProjectController;

const projectRouter = Router();

export default (app: Router): Router => {
  app.use('/project', projectRouter);

  //start a project
  projectRouter.route('/start-project').post(middlewares.isAuth, middlewares.attachCurrentUser, validator.startProject, startProject);

  //list project
  projectRouter.route('/list-project').get(getProject);

  return app;
};
