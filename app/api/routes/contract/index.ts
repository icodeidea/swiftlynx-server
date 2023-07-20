import { Router } from 'express'
import middlewares, { validator } from '../../middlewares';
import { ContractController } from '../../controllers'

const { 
    addContract, 
    getContract, 
    signContract ,
    updateContract,
    deleteContract,
    getAllContract
} = ContractController;

const contractRouter = Router();

export default (app: Router): Router => {
  app.use('/contract', contractRouter);

  //add contract
  contractRouter.route('/add-contract').post(middlewares.isAuth, middlewares.attachCurrentUser, validator.addContract, addContract);

  //update contract
  contractRouter.route('/update').put(middlewares.isAuth, middlewares.attachCurrentUser, validator.updateContract, updateContract);

  //delete contract
  contractRouter.route('/delete').delete(middlewares.isAuth, middlewares.attachCurrentUser, validator.deleteContract, deleteContract);

  //list contract
  contractRouter.route('/list-contract').get(getContract);

  //list all contract
  contractRouter.route('/list-all-contract').get(middlewares.isAuth, middlewares.attachCurrentUser, getAllContract);

  //sign contract
  contractRouter.route('/sign-contract').post(middlewares.isAuth, middlewares.attachCurrentUser, validator.signContract, signContract);

  return app;
};
