"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const logger_1 = __importDefault(require("./logger"));
const agenda_1 = __importDefault(require("./agenda"));
const config_1 = __importDefault(require("../config"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
// import mailgun from 'mailgun-js';
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
exports.default = ({ mongoConnection, models, }) => {
    try {
        models.forEach(m => {
            typedi_1.Container.set(m.name, m.model);
        });
        const agendaInstance = (0, agenda_1.default)({ mongoConnection });
        typedi_1.Container.set('agendaInstance', agendaInstance);
        typedi_1.Container.set('logger', logger_1.default);
        // Container.set('emailClient', mailgun({ apiKey: config.emails.apiKey, domain: config.emails.domain }));
        typedi_1.Container.set('emailClient', mail_1.default.setApiKey(config_1.default.emails.sendgridKey));
        logger_1.default.info('✌️ Agenda injected into container');
        return { agenda: agendaInstance };
    }
    catch (e) {
        logger_1.default.error('🔥 Error on dependency injector loader: %o', e);
        throw e;
    }
};
//# sourceMappingURL=dependencyInjector.js.map