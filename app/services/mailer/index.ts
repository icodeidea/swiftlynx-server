/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Service, Inject } from 'typedi';
import { IUser } from '../../interfaces/IUser';
import config from '../../config';
import { Document } from 'mongoose';
import { mail } from '../../utils';
@Service()
export class MailerService {
  constructor(@Inject('emailClient') private emailClient) { }

  public async SendWelcomeEmail({ email, verified }: IUser & Document) {
    const data = {
      from: 'Admin <${config.supportMail}>',
      to: email,
      subject: 'Welcome to ${config.appName} Social Network',
      html: `
      <br/>
      Welcome to <a href=${config.url} target='_blank'>${config.appName}</a>
      <br/>
      ${config.appName} is a blockchained powered news platform
      <br/>
      <br/>
      Please verify your email by clicking the url below:
      <br/>
      link expires in <b>24 hours</b>
      On the following page:
      <br/>
      <a href="${config.url}/auth/verify/${verified.token.value}">Verify Account</a>
      ${verified.token.value}
      <br/>
      Best wishes,
      ${config.appName} Team.
      `,
    };
    // this.emailClient.send(data);
    mail.sendinblue.send({
      to: data.to,
      subject: data.subject,
      text: data.subject,
      html: data.html,
    })
    return { delivered: 1, status: 'ok' };
  }

  public async ResendVerificationMail({ email, username, verified }: IUser & Document) {
    const data = {
      from: 'Admin <${config.supportMail}>',
      to: email,
      subject: `${config.appName} - Resend Verification`,
      html: `
      Hi there ${username},
      <br/>
      Welcome to <a href=${config.url} target='_blank'>${config.appName}</a>
      <br/><br/>
      Please verify your email by clicking the url below:
      <br/>
      link expires in <b>24 hours</b>
      On the following page:
      <br/>
      <a href="${config.url}/auth/verify/${verified.token.value}">Verify Account</a>
      <br/>
      <br/>
      <h3>
        <b>${verified.token.value}<b/>
      <h3/>
      Best wishes,
      ${config.appName} Team.
      `,
    };
    // this.emailClient.send(data);
    mail.sendinblue.send({
      to: data.to,
      subject: data.subject,
      text: data.subject,
      html: data.html,
    })
    return { delivered: 1, status: 'ok' };
  }

  public async SendPasswordResetMail({ email, reset }: IUser & Document) {
    const data = {
      from: 'Admin <${config.supportMail}>',
      to: email,
      subject: 'Password Reset',
      html: `
      Hi there,
      <br/>
      Welcome to <a href=${config.url} target='_blank'>${config.appName}</a>
      <br/><br/>
      A password reset email has been sent :
      <br/>
      link expires in <b>30 minutes</b>
      On the following page:
      <br/>
      <a href="${config.url}/auth/reset/${reset.token}">Reset Account Password</a>
      <p>otp ${reset.token}</p>
      <br/>
      Best wishes,
      ${config.appName} Team.
      `,
    };
    // this.emailClient.send(data);
    mail.sendinblue.send({
      to: data.to,
      subject: data.subject,
      text: data.subject,
      html: data.html,
    })
    return { delivered: 1, status: 'ok' };
  }

  public async ConfirmpaymentRequestMail(userRecord: any, contractRecord: any) {
    const data = {
      from: 'Admin <${config.supportMail}>',
      to: 'kingsleyonyeneke@gmail.com',
      subject: 'Loan: Confirm payment',
      html: `
      Hi Boss,
      <br/>
      you have a new payment confirmation request from: <a href=${config.url} target='_blank'>${userRecord.firstname} ${userRecord.firstname}</a>
      amount: ${contractRecord.fixedAmount}
      <br/><br/>
      `,
    };
    // this.emailClient.send(data);
    mail.sendinblue.send({
      to: data.to,
      subject: data.subject,
      text: data.subject,
      html: data.html,
    });

    mail.sendinblue.send({
      to: "swiftlynxtech@gmail.com",
      subject: data.subject,
      text: data.subject,
      html: data.html,
    });

    return { delivered: 1, status: 'ok' };
  }

  public async PayoutRequestMail() {
    const data = {
      from: 'Admin <${config.supportMail}>',
      to: 'kingsleyonyeneke@gmail.com',
      subject: 'Payout request',
      html: `
      Hi Boss,
      <br/>
      you have a new payout request from: <a href=${config.url} target='_blank'>${config.appName}</a>
      <br/><br/>
      `,
    };
    // this.emailClient.send(data);
    mail.sendinblue.send({
      to: data.to,
      subject: data.subject,
      text: data.subject,
      html: data.html,
    });

    mail.sendinblue.send({
      to: "swiftlynxtech@gmail.com",
      subject: data.subject,
      text: data.subject,
      html: data.html,
    });

    return { delivered: 1, status: 'ok' };
  }

  public StartEmailSequence(sequence: string, user: Partial<IUser>) {
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
}
