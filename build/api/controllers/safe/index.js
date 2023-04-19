"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeController = void 0;
const typedi_1 = require("typedi");
const services_1 = require("../../../services");
class SafeController {
}
exports.SafeController = SafeController;
_a = SafeController;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
SafeController.listMySafe = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling get safe endpoint');
    try {
        const safeServiceInstance = typedi_1.Container.get(services_1.SafeService);
        const data = await safeServiceInstance.list(req.currentUser.id);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
SafeController.createSafe = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling create safe endpoint');
    try {
        const safeServiceInstance = typedi_1.Container.get(services_1.SafeService);
        const data = await safeServiceInstance.startSavings(req.body, req.currentUser.id);
        return res.status(201).json({ success: true, data, message: 'safe created' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
//# sourceMappingURL=index.js.map