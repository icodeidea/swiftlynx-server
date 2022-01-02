import { Container } from 'typedi';
import LoggerInstance from './logger';
import agendaFactory from './agenda';
import config from '../config';
import sendgridMail from '@sendgrid/mail';
import { type } from 'os';
// import mailgun from 'mailgun-js';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default ({
  mongoConnection,
  models,
}: {
  mongoConnection: unknown;
  models: { name: string; model: unknown }[];
}) => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
    });

    const agendaInstance = agendaFactory({ mongoConnection });

    Container.set('agendaInstance', agendaInstance);
    Container.set('logger', LoggerInstance);
    // Container.set('emailClient', mailgun({ apiKey: config.emails.apiKey, domain: config.emails.domain }));
    Container.set('emailClient', sendgridMail.setApiKey(config.emails.sendgridKey));

    LoggerInstance.info('✌️ Agenda injected into container');

    return { agenda: agendaInstance };
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
