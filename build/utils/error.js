"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SystemError extends Error {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    constructor(statusCode = 500, ...params) {
        super(...params);
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SystemError);
        }
        this.name = 'SystemError';
        // Custom debugging information
        this.statusCode = statusCode;
        this.date = new Date();
    }
}
exports.default = SystemError;
//# sourceMappingURL=error.js.map