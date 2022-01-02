/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import config from '../config';
// import EmailSequenceJob from '../jobs/emailSequence';
import Agenda from 'agenda/es';

export default ({ agenda }: { agenda: Agenda }) => {
  agenda.define(
    'send-email',
    { priority: 10, concurrency: config.agenda.concurrency },
    // new EmailSequenceJob().handler,
  );

  agenda.start();
};
