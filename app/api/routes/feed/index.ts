import { Router } from 'express'
import middlewares, { validator } from '../../middlewares';
import { FeedController } from '../../controllers'

const { read, write, update, getFeedStackedData, addReaction, deleteFeed } = FeedController;

const feedRouter = Router();

export default (app: Router): Router => {
  app.use('/feed', feedRouter);

  //get  feeds
  feedRouter.route('/all').get(read);

  //get all homepage data
  feedRouter.route('/home-data-stack').get(getFeedStackedData);

  //add reaction to feed
  feedRouter.route('/add-reaction').post(middlewares.isAuth, middlewares.attachCurrentUser, addReaction);

  //create feed
  feedRouter.route('/create').post(middlewares.isAuth, validator.createFeed, middlewares.attachCurrentUser, middlewares.isAdmin, write);

  //update feed
  feedRouter.route('/update/:id').post(middlewares.isAuth, validator.createFeed, middlewares.attachCurrentUser, middlewares.isAdmin, update);

  //delete  feed
  // allowed : admin 
  feedRouter.route('/delete/:id').delete(middlewares.isAuth, middlewares.attachCurrentUser, middlewares.isAdmin, deleteFeed);

  return app;
};
