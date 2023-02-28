"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const typedi_1 = require("typedi");
const services_1 = require("../../../services");
class UserController {
}
exports.UserController = UserController;
_a = UserController;
UserController.updateAccount = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling Update Account with userId: %s', req.currentUser.id);
    try {
        const authServiceInstance = typedi_1.Container.get(services_1.AuthService);
        const result = await authServiceInstance.UpdateRecord({ updateRecord: req.body, userId: req.currentUser.id });
        return res.status(200).json({ success: true, data: result, message: 'user updated successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
UserController.getAccount = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling Get Account with userId: %s', req.currentUser.id);
    try {
        const authServiceInstance = typedi_1.Container.get(services_1.AuthService);
        const result = await authServiceInstance.GetUser({ userId: req.currentUser.id });
        return res.status(200).json({ success: true, data: result, message: 'user found' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
UserController.deleteAccount = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling Delete Account with userId: %s', req.currentUser.id);
    try {
        const authServiceInstance = typedi_1.Container.get(services_1.AuthService);
        const result = await authServiceInstance.DeleteUser({ userId: req.currentUser.id });
        return res.status(200).json({ success: true, data: {}, message: result });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
//# sourceMappingURL=index.js.map