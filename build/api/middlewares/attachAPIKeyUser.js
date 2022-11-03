"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const services_1 = require("../../services");
/**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const attachAPIKeyUser = async (req, res, next) => {
    const Logger = typedi_1.Container.get('logger');
    try {
        const accessServiceInstance = typedi_1.Container.get(services_1.AccessService);
        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            return res.status(401).json({ success: false, data: {}, message: 'You need valid api in the request header' });
        }
        const isValidAPIKey = await accessServiceInstance.checkAPIKeys({ apiKey, user: req.currentUser.id });
        if (!isValidAPIKey) {
            return res.status(401).json({ success: false, data: {}, message: 'You need valid api in the request header' });
        }
        const user = await accessServiceInstance.getAPIKeyUser({ apiKey });
        req.currentUser = user;
        req.apiKey = apiKey;
        return next();
    }
    catch (e) {
        Logger.error('🔥 Error attaching user to req: %o', e);
        return next(e);
    }
};
exports.default = attachAPIKeyUser;
//# sourceMappingURL=attachAPIKeyUser.js.map