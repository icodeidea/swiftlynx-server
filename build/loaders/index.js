"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("./express"));
const dependencyInjector_1 = __importDefault(require("./dependencyInjector"));
const mongoose_1 = __importDefault(require("./mongoose"));
const jobs_1 = __importDefault(require("./jobs"));
const logger_1 = __importDefault(require("./logger"));
//We have to import at least all the events once so they can be triggered
require("./events");
exports.default = async ({ expressApp }) => {
    const mongoConnection = await (0, mongoose_1.default)();
    logger_1.default.info('✌️ DB loaded and connected!');
    /**
     * WTF is going on here?
     *
     * We are injecting the mongoose models into the DI container.
     * I know this is controversial but will provide a lot of flexibility at the time
     * of writing unit tests, just go and check how beautiful they are!
     */
    //TODO make code DRY
    const userModel = {
        name: 'userModel',
        // Notice the require syntax and the '.default'
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        model: require('../models/user').default,
    };
    const APIKeyModel = {
        name: 'apiKeyModel',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        model: require('../models/apiKey').default,
    };
    const walletModel = {
        name: 'walletModel',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        model: require('../models/wallet').default,
    };
    const feedModel = {
        name: 'feedModel',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        model: require('../models/feed').default,
    };
    const commentModel = {
        name: 'commentModel',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        model: require('../models/comment').default,
    };
    const activityModel = {
        name: 'activityModel',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        model: require('../models/activity').default,
    };
    const transactionModel = {
        name: 'transactionModel',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        model: require('../models/transaction').default,
    };
    const appSettingModel = {
        name: 'appSettingModel',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        model: require('../models/appSettings').default,
    };
    const tradeModel = {
        name: 'tradeModel',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        model: require('../models/trade').default,
    };
    const contractModel = {
        name: 'contractModel',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        model: require('../models/contract').default,
    };
    const marketModel = {
        name: 'marketModel',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        model: require('../models/market').default,
    };
    const projectModel = {
        name: 'projectModel',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        model: require('../models/project').default,
    };
    const safeModel = {
        name: 'safeModel',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        model: require('../models/safe').default,
    };
    const payoutModel = {
        name: 'payoutModel',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        model: require('../models/payout').default,
    };
    const accountDetailModel = {
        name: 'accountDetailModel',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        model: require('../models/accountDetail').default,
    };
    // It returns the agenda instance because it's needed in the subsequent loaders
    const { agenda } = await (0, dependencyInjector_1.default)({
        mongoConnection,
        models: [
            userModel,
            APIKeyModel,
            walletModel,
            feedModel,
            commentModel,
            activityModel,
            transactionModel,
            appSettingModel,
            tradeModel,
            contractModel,
            marketModel,
            projectModel,
            safeModel,
            payoutModel,
            accountDetailModel
        ],
    });
    logger_1.default.info('✌️ Dependency Injector loaded');
    await (0, jobs_1.default)({ agenda });
    logger_1.default.info('✌️ Jobs loaded');
    await (0, express_1.default)({ app: expressApp });
    logger_1.default.info('✌️ Express loaded');
};
//# sourceMappingURL=index.js.map