import { Router } from 'express'
import middlewares, { validator } from '../../middlewares';
import { ProjectController } from '../../controllers'

const { startProject, getProject, updateProject, deleteProject} = ProjectController;

const projectRouter = Router();

export default (app: Router): Router => {
  app.use('/project', projectRouter);

  //start a project
  projectRouter.route('/create-project').post(middlewares.isAuth, middlewares.attachCurrentUser, validator.startProject, startProject);

  //list project
  projectRouter.route('/list-project').get(getProject);

  //update project
  projectRouter.route('/update').put(middlewares.isAuth, middlewares.attachCurrentUser, validator.updateProject, updateProject);

  //delete project
  projectRouter.route('/delete').delete(middlewares.isAuth, middlewares.attachCurrentUser, validator.deleteProject, deleteProject);

  return app;
};
