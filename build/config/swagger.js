"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const index_1 = __importDefault(require("./index"));
const { appName, environment, port, version } = index_1.default;
const env = environment, displayName = appName;
const description = () => fs_1.default.readFileSync('app/docs/description.md').toString();
const swagger = {
    swaggerDefinition: {
        info: {
            version,
            description: description(),
            title: `${displayName} (${env})`,
            contact: { name: 'IcodeIdea', email: 'icodeidea@gmail.com' },
            servers: [{ url: `http://localhost:${port}` }],
        },
    },
    apis: ['./src/docs/*.yml'],
};
const config = (0, swagger_jsdoc_1.default)(swagger);
exports.default = { config };
//# sourceMappingURL=swagger.js.map