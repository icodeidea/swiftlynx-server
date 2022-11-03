"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const services_1 = require("../../services");
const config_1 = __importDefault(require("../../config"));
const rateLimiterBasic = new rate_limiter_flexible_1.RateLimiterMemory({
    points: config_1.default.apiLevel.basic.points,
    duration: config_1.default.apiLevel.basic.duration, // per second
});
const rateLimiterPro = new rate_limiter_flexible_1.RateLimiterMemory({
    points: config_1.default.apiLevel.pro.points,
    duration: config_1.default.apiLevel.pro.duration, // per second
});
const rateLimiterMiddleware = async (req, res, next) => {
    try {
        const accessServiceInstance = typedi_1.Container.get(services_1.AccessService);
        const { plan, active } = await accessServiceInstance.identifyAPIForLimiter({
            providedKey: req.apiKey,
        });
        if (!active) {
            return res.status(401).json({ success: false, data: {}, message: 'The provided apiKey is currently inactive' });
        }
        if (plan === 'BASIC') {
            await rateLimiterBasic.consume(req.ip, 1);
        }
        else if (plan === 'PRO') {
            await rateLimiterPro.consume(req.ip, 1);
        }
        return next();
    }
    catch (e) {
        return res.status(429).json({
            success: false,
            message: 'Too many requests',
        });
    }
};
exports.default = rateLimiterMiddleware;
//# sourceMappingURL=rateLimiter.js.map