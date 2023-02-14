import fs from 'fs';
import swaggerJsDoc, { Options } from 'swagger-jsdoc';
import appConfig from './index';

const { appName, environment, port, version, api } = appConfig

const env = environment, displayName = appName ;

const description = () => fs.readFileSync('app/docs/description.md').toString();

const swagger: Options = {
  swaggerDefinition: {
    info: {
      version,
      description: description(),
      title: `${displayName} (${env})`,
      contact: { name: 'IcodeIdea', email: 'icodeidea@gmail.com' },
      servers: [{ url: `http://localhost:${port}` }],
    },
  },
  apis: ['./app/docs/*.yml'],
};

const config = swaggerJsDoc(swagger);

export default { config };
