"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const typedi_1 = require("typedi");
const services_1 = require("../../../services");
class TransactionController {
}
exports.TransactionController = TransactionController;
_a = TransactionController;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
TransactionController.getTransactions = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling get transactions endpoint');
    try {
        const transactionServiceInstance = typedi_1.Container.get(services_1.TransactionService);
        const data = await transactionServiceInstance.getTransactions(req.currentUser.id);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
TransactionController.getEntityTransactions = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling get transactions endpoint');
    try {
        const transactionServiceInstance = typedi_1.Container.get(services_1.TransactionService);
        const data = await transactionServiceInstance.getEntityTransactions(req.query.entityId);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
TransactionController.initPayment = async (req, res, next) => {
    var _b;
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling post initialise payment endpoint');
    try {
        const transactionServiceInstance = typedi_1.Container.get(services_1.TransactionService);
        const data = await transactionServiceInstance.initialisePayment((_b = req === null || req === void 0 ? void 0 : req.currentUser) === null || _b === void 0 ? void 0 : _b.id, req.body.amount, req.body.entity, req.body.entityId);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
TransactionController.paymentCallback = async (req, res, next) => {
    var _b;
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling verify payment endpoint');
    const ref = ((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.reference) || null;
    try {
        const transactionServiceInstance = typedi_1.Container.get(services_1.TransactionService);
        const data = await transactionServiceInstance.verifyPayment(ref);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
//# sourceMappingURL=index.js.map