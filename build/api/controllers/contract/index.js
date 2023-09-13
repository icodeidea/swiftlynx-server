"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractController = void 0;
const typedi_1 = require("typedi");
const services_1 = require("../../../services");
class ContractController {
}
exports.ContractController = ContractController;
_a = ContractController;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
ContractController.addContract = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling add contract endpoint');
    try {
        req.body.userId = req.currentUser.id;
        const contractServiceInstance = typedi_1.Container.get(services_1.ContractService);
        const data = await contractServiceInstance.addContract(req.body);
        return res.status(201).json({ success: true, data, message: 'contract added successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
ContractController.getContract = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling get contract endpoint');
    try {
        const contractIdOrProjectId = req.query.contractIdOrProjectId;
        const contractServiceInstance = typedi_1.Container.get(services_1.ContractService);
        const data = await contractServiceInstance.getContract(contractIdOrProjectId);
        return res.status(201).json({ success: true, data, message: 'contract(s) retrived successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
ContractController.getAllContract = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling get all contract endpoint');
    try {
        const contractServiceInstance = typedi_1.Container.get(services_1.ContractService);
        const data = await contractServiceInstance.getAllContract(req.currentUser.id);
        return res.status(201).json({ success: true, data, message: 'contract(s) retrived successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
ContractController.filterAllContract = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling filter all contract endpoint');
    try {
        const contractServiceInstance = typedi_1.Container.get(services_1.ContractService);
        const data = await contractServiceInstance.filter(req.params.state);
        return res.status(201).json({ success: true, data, message: 'contract(s) retrived successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
ContractController.requestPaymentConfrimation = async (req, res, next) => {
    var _b;
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling request payment confirmation endpoint');
    try {
        const contractServiceInstance = typedi_1.Container.get(services_1.ContractService);
        const data = await contractServiceInstance.requestPaymentConfirmation(req.currentUser.id, (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.entityId);
        return res.status(201).json({ success: true, data, message: 'contract(s) retrived successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
ContractController.signContract = async (req, res, next) => {
    var _b;
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling sign contract endpoint');
    try {
        const contractId = req.body.contractId;
        const contractServiceInstance = typedi_1.Container.get(services_1.ContractService);
        const data = await contractServiceInstance.signContract(contractId, req.currentUser.id, (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.amount);
        return res.status(201).json({ success: true, data, message: 'contract signed successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
ContractController.updateContract = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling Update Contract with userId: %s', req.currentUser.id);
    try {
        req.body.userId = req.currentUser.id;
        const contractServiceInstance = typedi_1.Container.get(services_1.ContractService);
        const data = await contractServiceInstance.updateContract(req.body);
        return res.status(201).json({ success: true, data, message: 'contract updated successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
ContractController.deleteContract = async (req, res, next) => {
    var _b;
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling delete contract endpoint');
    try {
        const contractId = (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.contractId;
        const contractServiceInstance = typedi_1.Container.get(services_1.ContractService);
        const data = await contractServiceInstance.deleteContract({
            userId: req.currentUser.id,
            contractId
        });
        return res.status(201).json({ success: true, data, message: 'contract(s) deleted successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
//# sourceMappingURL=index.js.map