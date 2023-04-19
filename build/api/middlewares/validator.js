"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validations_1 = require("../validations");
class Validator {
    async signup(req, _, next) {
        try {
            const validation = validations_1.AuthSchema.signupSchema.validate(Object.assign({}, req.body));
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    async OAuth(req, _, next) {
        try {
            const validation = validations_1.AuthSchema.OAuthSchema.validate({
                token: req.body.token,
            });
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    async signin(req, _, next) {
        try {
            console.log(req.body);
            const validation = await validations_1.AuthSchema.signinSchema.validateAsync({
                email: req.body.email,
                password: req.body.password,
            });
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    async validateEmail(req, _, next) {
        try {
            const validation = await validations_1.AuthSchema.onlyEmailSchema.validateAsync({
                email: req.body.email,
            });
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    async validatePassword(req, _, next) {
        try {
            const validation = await validations_1.AuthSchema.updatePasswordSchema.validateAsync({
                password: req.body.password,
            });
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    async resetPassword(req, _, next) {
        try {
            const validation = await validations_1.AuthSchema.authedUpdatePasswordSchema.validateAsync({
                current: req.body.current,
                password: req.body.password,
            });
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    async createFeed(req, _, next) {
        try {
            const validation = validations_1.FeedSchema.createFeedSchema.validate(Object.assign({}, req.body));
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    async createComment(req, _, next) {
        try {
            const validation = validations_1.CommentSchema.createCommentSchema.validate(Object.assign({}, req.body));
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    async updateUser(req, _, next) {
        try {
            const validation = await validations_1.AuthSchema.userUpdateSchema.validateAsync(Object.assign({}, req.body));
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    async updatePassword(req, _, next) {
        try {
            const validation = await validations_1.AuthSchema.authedUpdatePasswordSchema.validateAsync(Object.assign({}, req.body));
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    /**
     * Wallet Validators
     */
    async walletActivation(req, _, next) {
        try {
            const validation = validations_1.WalletSchema.activation.validate(Object.assign({}, req.body));
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    async withdrawFund(req, _, next) {
        try {
            const validation = validations_1.WalletSchema.withdrawalSchema.validate(Object.assign({}, req.body));
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    /**
     * Market Validators
     */
    async addMarket(req, _, next) {
        try {
            const validation = validations_1.MarketSchema.addMarketSchema.validate(Object.assign({}, req.body));
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    /**
     *  project Validators
     */
    async startProject(req, _, next) {
        try {
            const validation = validations_1.ProjectSchema.startProjectSchema.validate(Object.assign({}, req.body));
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    async updateProject(req, _, next) {
        try {
            const validation = validations_1.ProjectSchema.updateProjectSchema.validate(Object.assign({}, req.body));
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    async deleteProject(req, _, next) {
        try {
            const validation = validations_1.ProjectSchema.deleteProjectSchema.validate(Object.assign({}, req.body));
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    /**
     * contract validators
     */
    async addContract(req, _, next) {
        try {
            const validation = validations_1.ContractShema.addContractSchema.validate(Object.assign({}, req.body));
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    async updateContract(req, _, next) {
        try {
            const validation = validations_1.ContractShema.updateContractSchema.validate(Object.assign({}, req.body));
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    async signContract(req, _, next) {
        try {
            const validation = validations_1.ContractShema.signContractSchema.validate(Object.assign({}, req.body));
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    async deleteContract(req, _, next) {
        try {
            const validation = validations_1.ContractShema.getContractSchema.validate(Object.assign({}, req.body));
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
    /// safe 
    async createSafe(req, _, next) {
        try {
            const validation = validations_1.SafeSchema.createSafeSchema.validate(Object.assign({}, req.body));
            if (validation.error) {
                return next(validation.error);
            }
            return next();
        }
        catch (e) {
            next(e);
        }
    }
}
const validator = new Validator();
exports.default = validator;
//# sourceMappingURL=validator.js.map