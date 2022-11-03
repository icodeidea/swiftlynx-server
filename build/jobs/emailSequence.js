"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const services_1 = require("../services");
class EmailSequenceJob {
    async handler(job, done) {
        const Logger = typedi_1.Container.get('logger');
        try {
            Logger.debug('✌️ Email Sequence Job triggered!');
            const { email, username } = job.attrs.data;
            const mailerServiceInstance = typedi_1.Container.get(services_1.MailerService);
            await mailerServiceInstance.SendWelcomeEmail({ email, username });
            done();
        }
        catch (e) {
            Logger.error('🔥 Error with Email Sequence Job: %o', e);
            done(e);
        }
    }
}
exports.default = EmailSequenceJob;
//# sourceMappingURL=emailSequence.js.map