"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFound = dotenv_1.default.config();
if (process.env.NODE_ENV === 'development' && envFound.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
exports.default = {
    "version": "1.0.0",
    appName: 'Swiftlynx',
    environment: process.env.NODE_ENV,
    /**
     * Server Listening Port
     */
    port: parseInt(process.env.PORT, 10),
    url: process.env.SITE_URL,
    bscScanUrl: `${process.env.BSCSCAN_ENDPOINT_URL}?apikey=${process.env.BSCSCAN_APIKEY}&address=${process.env.ETH_WALLET_ADDRESS}`,
    /**
     * Database URI
     */
    databaseURL: process.env.MONGODB_URI,
    /**
     * JWT
     */
    jwtSecret: process.env.JWT_SECRET,
    jwtAlgorithm: process.env.JWT_ALGO,
    /** GOOGLE_OAUTH */
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    /**
     * Used by winston logger
     */
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },
    /**
     * Agenda.js stuff
     */
    agenda: {
        dbCollection: process.env.AGENDA_DB_URI,
        pooltime: process.env.AGENDA_POOL_TIME,
        concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
    },
    /**
     * Agendash config
     */
    agendash: {
        user: 'agendash',
        password: '123456',
    },
    /**
     * API configs
     */
    api: {
        prefix: '/api/v1',
    },
    /**
     * Mailgun email credentials
     */
    emails: {
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
        sendgridKey: process.env.SENDGRID_API,
    },
    /**
       * rate limiter
       */
    apiLevel: {
        basic: { points: 3, duration: 20 },
        pro: { points: 25, duration: 30 }, // 25 requests every 30 seconds
    },
    corsWhiteList: {
        allowedOrigin: [
            "http://localhost:3000",
            "http://localhost:4000",
            "https://beeng.vercel.app",
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
        allowedMethods: "GET,HEAD,PUT,POST,DELETE"
    }
};
//# sourceMappingURL=index.js.map