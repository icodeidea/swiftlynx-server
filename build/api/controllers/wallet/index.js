"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const typedi_1 = require("typedi");
const services_1 = require("../../../services");
class WalletController {
}
exports.WalletController = WalletController;
_a = WalletController;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
WalletController.getWalletInfo = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling get wallet endpoint');
    try {
        const walletServiceInstance = typedi_1.Container.get(services_1.WalletService);
        const data = await walletServiceInstance.getBalance(req.currentUser.id);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
WalletController.activateWallet = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling get wallet endpoint');
    try {
        const walletServiceInstance = typedi_1.Container.get(services_1.WalletService);
        const data = await walletServiceInstance.activateWallet(req.currentUser.id, req.body.address);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
WalletController.WithdrawFund = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling withdraw fund endpoint');
    try {
        const walletServiceInstance = typedi_1.Container.get(services_1.WalletService);
        const data = await walletServiceInstance.withdrawFund({ user: req.currentUser.id, amount: req.body.amount, address: req.body.address });
        return res.status(201).json({ success: true, data, message: 'Transfer Completed' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
//# sourceMappingURL=index.js.map