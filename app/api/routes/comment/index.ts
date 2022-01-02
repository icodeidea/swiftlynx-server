import { Router } from 'express'
import middlewares, { validator } from '../../middlewares';
import { CommentController } from '../../controllers'

const { read, write, deleteComment } = CommentController;

const commentRouter = Router();

export default (app: Router): Router => {
  app.use('/comment', commentRouter);

  //create comment
  commentRouter.route('/create').post(middlewares.isAuth, validator.createComment, middlewares.attachCurrentUser, write);

  //get  comments
  commentRouter.route('/all').get(read);

  //delete  comment
  // allowed : admin and comment owner
  commentRouter.route('/delete/:id').delete(middlewares.isAuth, middlewares.attachCurrentUser, deleteComment);

  return app;
};
