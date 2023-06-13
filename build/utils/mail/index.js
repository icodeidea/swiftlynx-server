"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReciepient3 = exports.generateReciepient2 = exports.generateReciepient = exports.sendinblue = void 0;
exports.sendinblue = __importStar(require("./sendinblue"));
// export * as ses from './ses';
const generateReciepient = (to) => {
    let reciepients;
    if (typeof to === 'string') {
        reciepients = [{ email: to }];
    }
    else {
        reciepients = to.map(email => ({ email }));
    }
    return reciepients;
};
exports.generateReciepient = generateReciepient;
const generateReciepient2 = (to) => {
    if (typeof to === 'string')
        return to;
    return to.join(',');
};
exports.generateReciepient2 = generateReciepient2;
const generateReciepient3 = (to) => {
    let reciepients;
    if (typeof to === 'string') {
        reciepients = [to];
        return reciepients;
    }
    return to;
};
exports.generateReciepient3 = generateReciepient3;
//# sourceMappingURL=index.js.map