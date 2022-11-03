"use strict";
/**
 *  MOTIVATION
 *  This is to attach check a user request if token or API key is calling the endpoint
 * reason for this is that we have APIs that are to be consumed by both platform and also can be interacted with API
 * as well
 * ======================
 * Once we setup rateLimit for API call access the beauty of this will be shown
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const services_1 = require("../../services");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("../../config"));
class AttachUser {
    constructor() {
        this.attachAPIKeyUser = async (req, res, next) => {
            const Logger = typedi_1.Container.get('logger');
            try {
                const accessServiceInstance = typedi_1.Container.get(services_1.AccessService);
                const apiKey = req.headers['x-api-key'];
                if (!apiKey) {
                    return res.status(401).json({ success: false, data: {}, message: 'You need valid api in the request header' });
                }
                const isValidAPIKey = await accessServiceInstance.checkPlatformAPIKeyValidity({ apiKey });
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
        this.attachCurrentUser = async (req, res, next) => {
            const Logger = typedi_1.Container.get('logger');
            try {
                await this.isValidToken(req);
                const UserModel = typedi_1.Container.get('userModel');
                const userRecord = await UserModel.findById(req.token._id);
                if (!userRecord) {
                    return res.sendStatus(401);
                }
                const currentUser = userRecord.toJSON();
                req.currentUser = currentUser;
                return next();
            }
            catch (e) {
                Logger.error('🔥 Error attaching user to req: %o', e);
                return next(e);
            }
        };
        this.attachUserByTokenOrApi = async (req, res, next) => {
            const Logger = typedi_1.Container.get('logger');
            try {
                const apiKeyHeader = req.headers['x-api-key'];
                if (apiKeyHeader) {
                    return await this.attachAPIKeyUser(req, res, next);
                }
                else {
                    const checkJWT = await this.isValidToken(req);
                    if (!checkJWT)
                        return res.sendStatus(401);
                    const walletModel = typedi_1.Container.get('walletModel');
                    const { user } = await walletModel.findOne({ user: req.token._id });
                    if (user)
                        return await this.attachCurrentUser(req, res, next);
                    else
                        res.status(401).json({
                            success: false,
                            message: 'wallet setup not completed, goto https://BeeNg.com to finish wallet setup',
                        });
                }
            }
            catch (e) {
                Logger.error('🔥 Error attaching user to req: %o', e);
                return next(e);
            }
        };
        this.getCurrentUser = async (token) => {
            const UserModel = typedi_1.Container.get('userModel');
            const userRecord = await UserModel.findById(token);
            return userRecord;
        };
        // private checkJWTHeader = async () => {
        //   // const UserModel = Container.get('userModel') as mongoose.Model<IUser & mongoose.Document>;
        //   // const userRecord = await UserModel.findById();
        //   // return userRecord;
        // };
        this.isValidToken = req => {
            const token = req.get('authorization');
            if (!token) {
                return false;
            }
            const bearer = token.substring(7);
            const decoded = this.decodedToken(bearer);
            req.token._id = decoded._id;
            return true;
        };
        this.decodedToken = (token) => (0, jsonwebtoken_1.verify)(token, config_1.default.jwtSecret);
    }
}
const attachUser = new AttachUser();
exports.default = attachUser;
//# sourceMappingURL=attachUser.js.map