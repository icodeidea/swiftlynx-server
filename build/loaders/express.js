"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// import { errors } from 'celebrate';
const cors_1 = __importDefault(require("cors"));
const api_1 = __importDefault(require("../api"));
const config_1 = __importDefault(require("../config"));
const swagger_1 = __importDefault(require("../config/swagger"));
const setPaginationOptions = (req, res, next) => {
    const { page = 1, limit = 10, offset = 0 } = req.query;
    req.paginationOptions = { page, limit, offset, sort: { createdAt: 'desc' } };
    req.token = { _id: '' };
    next();
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
exports.default = ({ app }) => {
    const { allowedOrigin, allowedHeaders, allowedMethods } = config_1.default.corsWhiteList;
    const corsOptions = {
        credentials: true,
        allowedHeaders: allowedHeaders,
        origin: function (origin, callback) {
            if (allowedOrigin.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: allowedMethods,
    };
    // Api documentation
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default.config));
    app.get('/status', (req, res) => {
        res.status(200).json({ result: 'working' });
    });
    // Middleware that transforms the raw string of req.body into json
    app.use(express_1.default.json());
    // Middleware that transforms the urlencoded of req.body into json
    app.use(express_1.default.urlencoded({ extended: true }));
    // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // It shows the real origin IP in the heroku or Cloudwatch logs
    app.enable('trust proxy');
    app.use(setPaginationOptions);
    app.use((0, cookie_parser_1.default)());
    // The magic package that prevents frontend developers going nuts
    // Alternate description:
    // Enable Cross Origin Resource Sharing to all origins by default
    app.use((0, cors_1.default)());
    // Mount API routes
    app.use(config_1.default.api.prefix, (0, api_1.default)());
    /// catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err['statusCode'] = 404;
        next(err);
    });
    app.use((err, req, res, next) => {
        console.log(err);
        //const status = parseInt(err.message.slice(err.message.lastIndexOf(' '), err.message.length - 1)) || 500;
        res.status(err.statusCode || 200).json({ success: false, data: {
                message: err.message || err,
            },
        });
    });
};
//# sourceMappingURL=express.js.map