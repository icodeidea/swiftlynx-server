"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
/**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const isAdmin = async (req, res, next) => {
    const Logger = typedi_1.Container.get('logger');
    try {
        const UserModel = typedi_1.Container.get('userModel');
        const userRecord = await UserModel.findById(req.token._id);
        if (!userRecord) {
            return res.sendStatus(401);
        }
        const currentUser = userRecord.toJSON();
        req.isAdmin = currentUser.role === 'MANAGER' ? true : false;
        if (!req.isAdmin) {
            return res.sendStatus(401);
        }
        return next();
    }
    catch (e) {
        Logger.error('🔥 Error attaching user to req: %o', e);
        return next(e);
    }
};
exports.default = isAdmin;
//# sourceMappingURL=isAdmin.js.map