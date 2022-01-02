import express from 'express';
import cookieParser from 'cookie-parser';
// import { errors } from 'celebrate';
import cors from 'cors';
import routes from '../api';
import config from '../config';

const setPaginationOptions = (req, res, next) => {
  const { page = 1, limit = 10, offset = 0 } = req.query;
  req.paginationOptions = { page, limit, offset, sort: { createdAt: 'desc' } };
  req.token = { _id: '' };
  next();
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default ({ app }: { app: express.Application }) => {
  const { allowedOrigin, allowedHeaders, allowedMethods } = config.corsWhiteList;

  const corsOptions = {
    credentials: true,
    allowedHeaders: allowedHeaders,
    origin: function (origin, callback) {
      if (allowedOrigin.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: allowedMethods,
  };

  app.get('/status', (req, res) => {
    res.status(200).json({ result: 'working' });
  });

  // Middleware that transforms the raw string of req.body into json
  app.use(express.json());

  // Middleware that transforms the urlencoded of req.body into json
  app.use(express.urlencoded({ extended: true }));

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');
  app.use(setPaginationOptions);
  app.use(cookieParser());

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Mount API routes
  app.use(config.api.prefix, routes());

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['statusCode'] = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    //const status = parseInt(err.message.slice(err.message.lastIndexOf(' '), err.message.length - 1)) || 500;
    res.status(err.statusCode  || 500).json({success: false, data: {
        message: err.message,
      },
    });
  });
};
