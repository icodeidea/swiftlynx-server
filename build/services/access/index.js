"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessService = void 0;
const typedi_1 = require("typedi");
// import MailerService from './mailer';
const crypto_1 = require("crypto");
const eventDispatcher_1 = require("../../decorators/eventDispatcher");
// import events from '../../subscribers/events';
const utils_1 = require("../../utils");
let AccessService = class AccessService {
    constructor(userModel, apiKeyModel, 
    // private mailer: MailerService,
    logger, eventDispatcher) {
        this.userModel = userModel;
        this.apiKeyModel = apiKeyModel;
        this.logger = logger;
        this.eventDispatcher = eventDispatcher;
    }
    async createAPIKey({ plan, user, name, }) {
        try {
            this.logger.silly('Generating API Key...');
            const userAPIKeys = await this.apiKeyModel.findOne({ user });
            const newAPIKey = `KW_${this.generateRandomString()}`;
            const data = {
                key: newAPIKey,
                name,
                account: user,
            };
            if (!userAPIKeys) {
                await this.apiKeyModel.create({
                    apis: [data],
                    user,
                    plan: plan || 'BASIC',
                });
            }
            else {
                const checkName = this.checkIfAPINameExists(userAPIKeys.apis, name);
                if (checkName)
                    throw new utils_1.SystemError(200, 'API key name already exists');
                //limit API create
                //TODO set to DB env
                if (userAPIKeys.apis.length >= 5)
                    throw new utils_1.SystemError(200, 'create API limit reached, you can oly create 5 apis');
                await userAPIKeys.apis.push(data);
                await userAPIKeys.save();
            }
            return newAPIKey;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async checkAPIKeys({ apiKey, user }) {
        this.logger.silly('Decrypting SecretKey...');
        try {
            const userAPI = await this.apiKeyModel.findOne({ user });
            if (!userAPI)
                return false;
            const checkAPI = userAPI.apis.find(access => access.key === apiKey);
            if (!checkAPI)
                return false;
            return true;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async checkPlatformAPIKeyValidity({ apiKey }) {
        this.logger.silly('Decrypting SecretKey...');
        try {
            const userAPI = await this.apiKeyModel.findOne({ apis: { $elemMatch: { key: apiKey } } });
            console.log(userAPI);
            if (!userAPI)
                return false;
            // const checkAPI = userAPI.apis.find(access => access.key === apiKey);
            // if (!checkAPI) return false;
            return true;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async getAPIKeyUser({ apiKey }) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        try {
            const getAPI = await this.apiKeyModel.findOne({ apis: { $elemMatch: { key: apiKey } } });
            console.log('this is it', getAPI);
            const user = await this.userModel.findById(getAPI.user);
            return user;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async identifyAPIForLimiter({ providedKey, }) {
        this.logger.silly('Decrypting Identifying APIKey...');
        try {
            const apiKeys = await this.apiKeyModel.findOne({ key: providedKey });
            const { active } = apiKeys.apis[0];
            return { active };
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async listUserAPI({ user }) {
        this.logger.silly('Listing User API Keys');
        try {
            const apiKeys = await this.apiKeyModel.findOne({ user });
            if (!apiKeys)
                throw new utils_1.SystemError(200, 'you have not created any APIs');
            // delete apiKeys.
            return apiKeys['apis'];
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    generateRandomString() {
        return (0, crypto_1.randomBytes)(21).toString('hex');
    }
    checkIfAPINameExists(api, name) {
        const checkAPI = api.find(access => access.name === name);
        if (checkAPI)
            return true;
        return false;
    }
};
AccessService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('userModel')),
    __param(1, (0, typedi_1.Inject)('apiKeyModel')),
    __param(2, (0, typedi_1.Inject)('logger')),
    __param(3, (0, eventDispatcher_1.EventDispatcher)()),
    __metadata("design:paramtypes", [Object, Object, Object, eventDispatcher_1.EventDispatcherInterface])
], AccessService);
exports.AccessService = AccessService;
//# sourceMappingURL=index.js.map