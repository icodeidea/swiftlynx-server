import 'reflect-metadata';

import config from './config';

import express from 'express';

import Logger from './loaders/logger';

import { initExchangeRateTracking } from "./utils/exchange_rates"

async function startServer() {
  const app = express();

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await require('./loaders').default({ expressApp: app });

  app
    .listen(config.port, () => {
      Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡🙏🙏🙏
      ################################################
    `);

    // Start tracking exchange rates
    initExchangeRateTracking();
    })
    .on('error', err => {
      Logger.error(err);
      process.exit(1);
    });
}

startServer();