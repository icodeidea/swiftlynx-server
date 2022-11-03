"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeedSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createFeedSchema = joi_1.default.object({
    title: joi_1.default.string().required().max(100),
    content: joi_1.default.string().required(),
    shortContent: joi_1.default.string().required(),
    tags: joi_1.default.array().required(),
    image: joi_1.default.string().required(),
    reward: joi_1.default.number().required().max(100),
    published: joi_1.default.boolean(),
});
//# sourceMappingURL=feed.js.map