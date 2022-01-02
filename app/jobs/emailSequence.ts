import { Container } from 'typedi';
import { MailerService }  from '../services';
import { Logger } from 'winston';
import { IUser } from '../interfaces/IUser';
import { Document } from 'mongoose';

export default class EmailSequenceJob {
  public async handler(
    job: { attrs: { data: { [key: string]: string } } },
    done: (arg0?: unknown) => void,
  ): Promise<void> {
    const Logger: Logger = Container.get('logger');
    try {
      Logger.debug('✌️ Email Sequence Job triggered!');
      const { email, username }: { [key: string]: string } = job.attrs.data;
      const mailerServiceInstance = Container.get(MailerService);
      await mailerServiceInstance.SendWelcomeEmail({ email, username } as IUser & Document);
      done();
    } catch (e) {
      Logger.error('🔥 Error with Email Sequence Job: %o', e);
      done(e);
    }
  }
}
