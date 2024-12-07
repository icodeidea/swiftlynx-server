/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Service, Inject } from 'typedi';
import { IUser } from '../../interfaces/IUser';
import config from '../../config';
import { Document } from 'mongoose';
import { mail } from '../../utils';

@Service()
export class MailerService {
  constructor(@Inject('emailClient') private emailClient) { }

  private generateEmailHeader() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background-color: #f4f4f4; border-radius: 10px; padding: 20px; }
        .header { background-color: #FFF; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background-color: white; padding: 20px; border-radius: 0 0 10px 10px; }
        .button { 
          display: inline-block; 
          background-color: #007bff; 
          color: white; 
          padding: 10px 20px; 
          text-decoration: none; 
          border-radius: 5px; 
          margin: 15px 0;
        }
        .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        table, th, td { border: 1px solid #ddd; }
        th, td { padding: 10px; text-align: left; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://www.swiftlynxtechnologies.com/public/default_assets/wp-content/themes/mitech/assets/images/logo/Swiftlynx-logo-kennedy.png" alt="${config.appName} Logo" /> 
          
        </div>
        <div class="content">
    `;
  }

  // <h1>${config.appName}</h1>

  private generateEmailFooter() {
    return `
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ${config.appName}. All rights reserved.</p>
          <p>If you did not request this email, please ignore it or contact support.</p>
                    <div class="social-icons">
            <a href="${config.socialLinks.facebook}"><img src="cid:facebook-icon" alt="Facebook" /></a>
            <a href="${config.socialLinks.twitter}"><img src="cid:twitter-icon" alt="Twitter" /></a>
            <a href="${config.socialLinks.linkedin}"><img src="cid:linkedin-icon" alt="LinkedIn" /></a>
          </div>
          <p><a href="${config.url}/unsubscribe">Unsubscribe</a> | <a href="${config.url}/preferences">Email Preferences</a></p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  public async SendWelcomeEmail({ email, verified, username }: IUser & Document) {
    const data = {
      from: `Admin <${config.supportMail}>`,
      to: email,
      subject: `Welcome to ${config.appName}!`,
      html: this.generateEmailHeader() + `
        <h2>Welcome Aboard, ${username}!</h2>
        <p>We're thrilled to have you join ${config.appName}, We provide incredible IT services, Partnership & Funds offer to scale up your business.</p>
        
        <p>To get started and unlock the full potential of your account, please verify your email address by clicking the button below:</p>
        
        <a href="${config.url}/auth/verify/${verified.token.value}" class="button">Verify My Account</a>
        
        <p><strong>Important:</strong> This verification link will expire in 24 hours. If you don't verify within this time, you'll need to request a new verification email.</p>
        
        <h3>What's Next?</h3>
        <ul>
          <li>Complete your profile</li>
          <li>Explore our latest financial offers </li>
          <li>Connect with our community</li>
        </ul>
        
        <p>Your verification token (for reference): <code>${verified.token.value}</code></p>
      ` + this.generateEmailFooter(),
    };

    await mail.sendinblue.send({
      to: data.to,
      subject: data.subject,
      text: data.subject,
      html: data.html,
    });

    return { delivered: 1, status: 'ok' };
  }

  public async ResendVerificationMail({ email, username, verified }: IUser & Document) {
    const data = {
      from: `Admin <${config.supportMail}>`,
      to: email,
      subject: `${config.appName} - Verification Reminder`,
      html: this.generateEmailHeader() + `
        <h2>Hey ${username}, Complete Your Account Setup!</h2>
        
        <p>We noticed you haven't verified your account yet. No worries! Click the button below to activate your ${config.appName} account:</p>
        
        <a href="${config.url}/auth/verify/${verified.token.value}" class="button">Verify My Account Now</a>
        
        <p>This link will be active for the next 24 hours. After that, you'll need to request a new verification email.</p>
        
        <h3>Why Verify?</h3>
        <ul>
          <li>Unlock full platform features</li>
          <li>Ensure account security</li>
          <li>Enable personalized experiences</li>
        </ul>
        
        <p>Your verification token: <code>${verified.token.value}</code></p>
        
        <p>Having trouble? Contact our support team at ${config.supportMail}</p>
      ` + this.generateEmailFooter(),
    };

    await mail.sendinblue.send({
      to: data.to,
      subject: data.subject,
      text: data.subject,
      html: data.html,
    });

    return { delivered: 1, status: 'ok' };
  }

  public async SendPasswordResetMail({ email, username, reset }: IUser & Document) {
    const data = {
      from: `Admin <${config.supportMail}>`,
      to: email,
      subject: 'Password Reset Request',
      html: this.generateEmailHeader() + `
        <h2>Password Reset for ${username}</h2>
        
        <p>We received a request to reset the password for your ${config.appName} account. If you didn't make this request, please ignore this email.</p>
        
        <a href="${config.url}/auth/reset/${reset.token}" class="button">Reset My Password</a>
        
        <p><strong>Important:</strong> This password reset link is valid for only 30 minutes. After that, you'll need to request a new reset link.</p>
        
        <h3>Security Tips:</h3>
        <ul>
          <li>Never share your password with anyone</li>
          <li>Use a strong, unique password</li>
          <li>Consider using a password manager</li>
        </ul>
        
        <p>Your one-time password reset code: <code>${reset.token}</code></p>
        
        <p>If you didn't request this reset, please contact our security team immediately at ${config.supportMail}</p>
      ` + this.generateEmailFooter(),
    };

    await mail.sendinblue.send({
      to: data.to,
      subject: data.subject,
      text: data.subject,
      html: data.html,
    });

    return { delivered: 1, status: 'ok' };
  }

  public async ConfirmpaymentRequestMail(userRecord: any, contractRecord: any) {
    const data = {
      from: `Admin <${config.supportMail}>`,
      to: 'kingsleyonyeneke@gmail.com',
      subject: 'Loan: Confirm Payment Request',
      html: this.generateEmailHeader() + `
        <h2>Payment Confirmation Request</h2>
        
        <p>A new payment confirmation request has been submitted:</p>
        
        <table>
          <tr>
            <th>Requester Name</th>
            <td>${userRecord.firstname} ${userRecord.lastname}</td>
          </tr>
          <tr>
            <th>Amount</th>
            <td>${new Intl.NumberFormat('en-US', { 
              style: 'currency', 
              currency: 'NGN' 
            }).format(contractRecord.fixedAmount)}</td>
          </tr>
        </table>
        
        <p>Please review and process the payment request at your earliest convenience.</p>
        
        <a href="${config.url}" class="button">Review Request</a>
      ` + this.generateEmailFooter(),
    };

    // Send to primary recipient
    await mail.sendinblue.send({
      to: data.to,
      subject: data.subject,
      text: data.subject,
      html: data.html,
    });

    // Send to secondary recipient
    await mail.sendinblue.send({
      to: "swiftlynxtech@gmail.com",
      subject: data.subject,
      text: data.subject,
      html: data.html,
    });

    return { delivered: 2, status: 'ok' };
  }

  public async PayoutRequestMail(mail_data: {
    firstname: string,
    lastname: string,
    user_email: string,
    desc: string,
    startDate: string,
    endDate: string,
    isDue: boolean,
    status: string,
    amount: number
  }) {
    try {
      // Validate input data
      if (!mail_data.firstname || !mail_data.lastname || !mail_data.amount) {
        throw new Error('Missing required payout request information');
      }
  
      // Format the amount with currency formatting
      const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN'
      }).format(mail_data.amount);
  
      // Create a more detailed HTML email template
      const htmlTemplate = this.generateEmailHeader() + `
        <h2>New Payout Request Received</h2>
        
        <table>
          <tr>
            <th>Requester Name</th>
            <td>${mail_data.firstname} ${mail_data.lastname}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>${mail_data.user_email}</td>
          </tr>
          <tr>
            <th>Amount</th>
            <td>${formattedAmount}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>${mail_data.desc || 'No description provided'}</td>
          </tr>
          <tr>
            <th>Date Range</th>
            <td>${mail_data.startDate} to ${mail_data.endDate}</td>
          </tr>
          <tr>
            <th>Status</th>
            <td>${mail_data.status}</td>
          </tr>
          <tr>
            <th>Is Due / Matured</th>
            <td>${mail_data.isDue ? 'Yes' : 'No'}</td>
          </tr>
        </table>
        
        <a href="${config.url}" class="button">Review Payout Request</a>
        
        <p>Please review and process the payout request promptly.</p>
      ` + this.generateEmailFooter();
  
      // Prepare email configuration
      const emailConfig = {
        subject: `Payout Request from ${mail_data.firstname} ${mail_data.lastname}`,
        html: htmlTemplate,
        text: `New payout request from ${mail_data.firstname} ${mail_data.lastname} for ${formattedAmount}`
      };
  
      // Send emails to multiple recipients
      const recipients = config.recipients || ['kingsleyonyeneke@gmail.com', 'swiftlynxtech@gmail.com'];
  
      // Track email sending results
      const sendResults = await Promise.all(
        recipients.map(async (recipient) => {
          try {
            await mail.sendinblue.send({
              to: recipient,
              subject: emailConfig.subject,
              html: emailConfig.html,
              text: emailConfig.text
            });
            return { recipient, status: 'success' };
          } catch (error) {
            console.error(`Failed to send email to ${recipient}:`, error);
            return { recipient, status: 'failed', error: error.message };
          }
        })
      );
  
      // Check if all emails were sent successfully
      const allSent = sendResults.every(result => result.status === 'success');
  
      return {
        delivered: allSent ? recipients.length : 0,
        status: allSent ? 'ok' : 'partial_failure',
        details: sendResults
      };
    } catch (error) {
      console.error('Payout request email error:', error);
      
      return {
        delivered: 0,
        status: 'error',
        message: error.message
      };
    }
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