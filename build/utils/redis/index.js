"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
// Create Redis client
exports.redis = new ioredis_1.default(process.env.REDIS_HOST || "redis://default:mVLTKx5ScBUFl3iK5DghTTjFfKYjzcba@redis-15508.c341.af-south-1-1.ec2.redns.redis-cloud.com:15508");
console.log("Connecting to the Redis");
exports.redis.on("ready", () => {
    console.log("redis Connected!");
});
// listening for errors
exports.redis.on("error", (error) => {
    console.error('redis', `redis ${error.message}`);
});
//# sourceMappingURL=index.js.map