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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const typedi_1 = require("typedi");
const config_1 = __importDefault(require("../../config"));
const utils_1 = require("../../utils");
let MailerService = class MailerService {
    constructor(emailClient) {
        this.emailClient = emailClient;
    }
    async SendWelcomeEmail({ email, verified }) {
        const data = {
            from: 'Admin <${config.supportMail}>',
            to: email,
            subject: 'Welcome to ${config.appName} Social Network',
            html: `
      <br/>
      Welcome to <a href=${config_1.default.url} target='_blank'>${config_1.default.appName}</a>
      <br/>
      ${config_1.default.appName} is a blockchained powered news platform
      <br/>
      <br/>
      Please verify your email by clicking the url below:
      <br/>
      link expires in <b>24 hours</b>
      On the following page:
      <br/>
      <a href="${config_1.default.url}/auth/verify/${verified.token.value}">Verify Account</a>
      ${verified.token.value}
      <br/>
      Best wishes,
      ${config_1.default.appName} Team.
      `,
        };
        // this.emailClient.send(data);
        utils_1.mail.sendinblue.send({
            to: data.to,
            subject: data.subject,
            text: data.subject,
            html: data.html,
        });
        return { delivered: 1, status: 'ok' };
    }
    async ResendVerificationMail({ email, username, verified }) {
        const data = {
            from: 'Admin <${config.supportMail}>',
            to: email,
            subject: `${config_1.default.appName} - Resend Verification`,
            html: `
      Hi there ${username},
      <br/>
      Welcome to <a href=${config_1.default.url} target='_blank'>${config_1.default.appName}</a>
      <br/><br/>
      Please verify your email by clicking the url below:
      <br/>
      link expires in <b>24 hours</b>
      On the following page:
      <br/>
      <a href="${config_1.default.url}/auth/verify/${verified.token.value}">Verify Account</a>
      <br/>
      <br/>
      <h3>
        <b>${verified.token.value}<b/>
      <h3/>
      Best wishes,
      ${config_1.default.appName} Team.
      `,
        };
        // this.emailClient.send(data);
        utils_1.mail.sendinblue.send({
            to: data.to,
            subject: data.subject,
            text: data.subject,
            html: data.html,
        });
        return { delivered: 1, status: 'ok' };
    }
    async SendPasswordResetMail({ email, reset }) {
        const data = {
            from: 'Admin <${config.supportMail}>',
            to: email,
            subject: 'Password Reset',
            html: `
      Hi there,
      <br/>
      Welcome to <a href=${config_1.default.url} target='_blank'>${config_1.default.appName}</a>
      <br/><br/>
      A password reset email has been sent :
      <br/>
      link expires in <b>30 minutes</b>
      On the following page:
      <br/>
      <a href="${config_1.default.url}/auth/reset/${reset.token}">Reset Account Password</a>
      <p>otp ${reset.token}</p>
      <br/>
      Best wishes,
      ${config_1.default.appName} Team.
      `,
        };
        // this.emailClient.send(data);
        utils_1.mail.sendinblue.send({
            to: data.to,
            subject: data.subject,
            text: data.subject,
            html: data.html,
        });
        return { delivered: 1, status: 'ok' };
    }
    async PayoutRequestMail() {
        const data = {
            from: 'Admin <${config.supportMail}>',
            to: 'kingsleyonyeneke@gmail.com',
            subject: 'Payout request',
            html: `
      Hi Boss,
      <br/>
      you have a new payout request from: <a href=${config_1.default.url} target='_blank'>${config_1.default.appName}</a>
      <br/><br/>
      `,
        };
        // this.emailClient.send(data);
        utils_1.mail.sendinblue.send({
            to: data.to,
            subject: data.subject,
            text: data.subject,
            html: data.html,
        });
        return { delivered: 1, status: 'ok' };
    }
    StartEmailSequence(sequence, user) {
        if (!user.email) {
            throw new Error('No email provided');
        }
        // @TODO Add example of an email sequence implementation
        // Something like
        // 1 - Send first email of the sequence
        // 2 - Save the step of the sequence in database
        // 3 - Schedule job for second email in 1-3 days or whatever
        // Every sequence can have its own behavior so maybe
        // the pattern Chain of Responsibility can help here.
        return { delivered: 1, status: 'ok' };
    }
};
MailerService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('emailClient')),
    __metadata("design:paramtypes", [Object])
], MailerService);
exports.MailerService = MailerService;
//# sourceMappingURL=index.js.map