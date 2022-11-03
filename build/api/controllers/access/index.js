"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAPIKeys = exports.createAccess = void 0;
const typedi_1 = require("typedi");
const services_1 = require("../../../services");
const createAccess = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling Create api-key endpoint by user: %s', req.currentUser.email);
    try {
        const accessServiceInstance = typedi_1.Container.get(services_1.AccessService);
        const apiKey = await accessServiceInstance.createAPIKey({
            plan: 'BASIC',
            user: req.currentUser.id,
            name: req.body.name,
        });
        return res.status(201).json({ success: true, data: apiKey, message: '' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
exports.createAccess = createAccess;
const getUserAPIKeys = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling get user API: %s', req.currentUser.email);
    try {
        const accessServiceInstance = typedi_1.Container.get(services_1.AccessService);
        const apiKey = await accessServiceInstance.listUserAPI({ user: req.currentUser.id });
        return res.status(200).json({ success: true, data: apiKey, message: '' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
exports.getUserAPIKeys = getUserAPIKeys;
//# sourceMappingURL=index.js.map