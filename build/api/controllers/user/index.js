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
UserController.updateRole = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling Update Role with userId: %s', req.body.userId);
    try {
        const authServiceInstance = typedi_1.Container.get(services_1.AuthService);
        const result = await authServiceInstance.UpdateRecord({ updateRecord: { role: req.body.role }, userId: req.body.userId });
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
UserController.filterAccounts = async (req, res, next) => {
    var _b, _c;
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling Get Account with userId');
    try {
        const authServiceInstance = typedi_1.Container.get(services_1.AuthService);
        const result = await authServiceInstance.FilterUsers({ key: (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.key, value: (_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.value });
        return res.status(200).json({ success: true, data: result, message: 'users found' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
UserController.getUserKpi = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling Get User Kpi with userId: %s', req.currentUser.id);
    try {
        const authServiceInstance = typedi_1.Container.get(services_1.AuthService);
        const result = await authServiceInstance.GetUserKpi({ userId: req.currentUser.id });
        return res.status(200).json({ success: true, data: result, message: 'user kpi' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
UserController.UpdatePassword = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling update Account password with userId: %s', req.currentUser.id);
    try {
        const authServiceInstance = typedi_1.Container.get(services_1.AuthService);
        const result = await authServiceInstance.AuthedUpdatePassword(req.currentUser.id, req.body.password, req.body.newPassword);
        return res.status(200).json({ success: true, data: {}, message: result });
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