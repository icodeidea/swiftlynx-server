  
import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import feed from './routes/feed';
import comment from './routes/comment';
import transaction from './routes/transaction';
import wallet from './routes/wallet';
import market from './routes/market';
import project from './routes/project';
import contract from './routes/contract';
import trade from './routes/trade';
// guaranteed to get dependencies
export default (): Router => {
  const app = Router();
  auth(app);
  user(app);
  feed(app);
  comment(app);
  transaction(app);
  wallet(app);
  market(app);
  project(app);
  contract(app);
  trade(app);
  return app;
};