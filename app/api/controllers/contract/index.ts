import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import { ContractService } from '../../../services';
import { IContract, IContractInputDTO } from '../../../interfaces/';

export class ContractController {

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static addContract = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling add contract endpoint');
    try {
      req.body.userId = req.currentUser.id;
      const contractServiceInstance = Container.get(ContractService);
      const data = await contractServiceInstance.addContract(req.body as IContractInputDTO);
      return res.status(201).json({ success: true, data, message: 'contract added successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static getContract = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling get contract endpoint');
    try {
      const contractIdOrProjectId = req.query.contractIdOrProjectId as string;
      const contractServiceInstance = Container.get(ContractService);
      const data = await contractServiceInstance.getContract(contractIdOrProjectId);
      return res.status(201).json({ success: true, data, message: 'contract(s) retrived successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static getAllContract = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling get all contract endpoint');
    try {
      const contractServiceInstance = Container.get(ContractService);
      const data = await contractServiceInstance.getAllContract(req.currentUser.id);
      return res.status(201).json({ success: true, data, message: 'contract(s) retrived successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static filterAllContract = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling filter all contract endpoint');
    try {
      const contractServiceInstance = Container.get(ContractService);
      const data = await contractServiceInstance.filter(req.params.state)
      return res.status(201).json({ success: true, data, message: 'contract(s) retrived successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static requestPaymentConfrimation = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling request payment confirmation endpoint');
      try {
        const contractServiceInstance = Container.get(ContractService);
        const data = await contractServiceInstance.requestPaymentConfirmation(req.currentUser.id, req?.query?.entityId as string);
        return res.status(201).json({ success: true, data, message: 'contract(s) retrived successfully' });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static signContract = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling sign contract endpoint');
    try {
      const contractId = req.body.contractId;
      const contractServiceInstance = Container.get(ContractService);
      const data = await contractServiceInstance.signContract(contractId, req.currentUser.id, req?.body?.amount);
      return res.status(201).json({ success: true, data, message: 'contract signed successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  static updateContract = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling Update Contract with userId: %s', req.currentUser.id);
    try {
      req.body.userId = req.currentUser.id;
      const contractServiceInstance = Container.get(ContractService);
      const data = await contractServiceInstance.updateContract(req.body as IContractInputDTO);
      return res.status(201).json({ success: true, data, message: 'contract updated successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  static updateContractState = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling Update Contract with userId');
    try {
      // req.body.userId = req.currentUser.id;
      const contractServiceInstance = Container.get(ContractService);
      const data = await contractServiceInstance.updateContractState({contractId: req.body.contractId, state: req.body.state});
      return res.status(201).json({ success: true, data, message: 'contract updated successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static deleteContract = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling delete contract endpoint');
      try {
        const contractId = req?.body?.contractId;
        const contractServiceInstance = Container.get(ContractService);
        const data = await contractServiceInstance.deleteContract({
          userId: req.currentUser.id,
          contractId
        });
        return res.status(201).json({ success: true, data, message: 'contract(s) deleted successfully' });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    };


}
