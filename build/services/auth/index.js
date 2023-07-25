"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const typedi_1 = require("typedi");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailer_1 = require("../mailer");
const wallet_1 = require("../wallet");
const config_1 = __importDefault(require("../../config"));
const nanoid_1 = require("nanoid");
const argon2_1 = __importDefault(require("argon2"));
const crypto_1 = require("crypto");
const eventDispatcher_1 = require("../../decorators/eventDispatcher");
const events_1 = __importDefault(require("../../subscribers/events"));
const utils_1 = require("../../utils");
const google_auth_library_1 = require("google-auth-library");
const slugify_1 = __importDefault(require("slugify"));
let AuthService = class AuthService {
    constructor(userModel, walletModel, tradeModel, safeModel, mailer, wallet, logger, eventDispatcher) {
        this.userModel = userModel;
        this.walletModel = walletModel;
        this.tradeModel = tradeModel;
        this.safeModel = safeModel;
        this.mailer = mailer;
        this.wallet = wallet;
        this.logger = logger;
        this.eventDispatcher = eventDispatcher;
    }
    async SignUp(userInputDTO) {
        try {
            console.log(userInputDTO);
            // throw new SystemError(401, 'System under maintenance, try again later');
            const exists = await this.isUsed({ email: userInputDTO.email });
            if (exists) {
                throw new utils_1.SystemError(401, 'email or username already in use');
            }
            if (userInputDTO === null || userInputDTO === void 0 ? void 0 : userInputDTO.referer) {
                const refUser = await this.userModel.findOne({ refId: userInputDTO.referer });
                if (refUser) {
                    userInputDTO.referer = refUser.id;
                }
            }
            const salt = (0, crypto_1.randomBytes)(32);
            this.logger.silly('Hashing password...');
            const hashedPassword = await argon2_1.default.hash(userInputDTO.password, { salt });
            this.logger.silly('Creating user db record');
            const saltHex = salt.toString('hex');
            const refId = await this.generateRefId(userInputDTO.username);
            const userRecord = await this.userModel.create(Object.assign(Object.assign({}, userInputDTO), { refId, salt: salt.toString('hex'), password: hashedPassword, oneTimeSetup: true, verified: {
                    token: {
                        value: saltHex.substr(2, 16),
                    },
                } }));
            const walletRecord = await this.walletModel.create({
                user: userRecord.id,
            });
            userRecord.wallet = walletRecord.id;
            await userRecord.save();
            if (!userRecord) {
                throw new utils_1.SystemError(500, 'User cannot be created');
            }
            this.logger.silly('Generating JWT...');
            this.logger.silly('Welcome Email will be sent at this point...');
            await this.mailer.SendWelcomeEmail(userRecord);
            this.eventDispatcher.dispatch(events_1.default.user.signUp, { user: userRecord });
            await this.millestoneCommision({ userId: userRecord.id, dollar: 0.11, reason: 'signup reward' });
            return 'Account Created, Verification email has been sent';
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async GoogleAuth({ token, refCode }) {
        try {
            const gooleClient = new google_auth_library_1.OAuth2Client(config_1.default.googleClientID);
            const ticket = await gooleClient.verifyIdToken({
                idToken: token,
                audience: config_1.default.googleClientID
            });
            const { name, email, picture } = ticket.getPayload();
            console.log('this is email', email);
            const exists = await this.isUsed({ email: email });
            if (exists) {
                return this.finalAuth(exists);
            }
            throw new utils_1.SystemError(401, 'System under maintenance, try again later');
            const salt = (0, crypto_1.randomBytes)(32);
            this.logger.silly('Creating user db record');
            const saltHex = salt.toString('hex');
            const refId = await this.generateRefId(name);
            const userRecord = await this.userModel.create({
                email: email,
                username: name,
                picture,
                refId,
                salt: salt.toString('hex'),
                oneTimeSetup: true,
                verified: {
                    token: {
                        value: saltHex.substr(2, 16),
                    },
                    isVerified: true,
                },
                passwordSet: false,
            });
            const walletRecord = await this.walletModel.create({
                user: userRecord.id,
            });
            userRecord.wallet = walletRecord.id;
            const referer = await this.creditReferer(refCode);
            if (referer) {
                userRecord.referer = referer;
            }
            await this.millestoneCommision({ userId: userRecord.id, dollar: 0.11, reason: 'signup reward' });
            await userRecord.save();
            if (!userRecord) {
                throw new utils_1.SystemError(500, 'User cannot be created');
            }
            return this.finalAuth(userRecord);
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async SignIn({ email, password, }) {
        const userRecord = await this.isUsed({ email });
        if (!userRecord) {
            throw new utils_1.SystemError(200, 'invalid username or password credentials');
        }
        if (!userRecord.passwordSet) {
            throw new utils_1.SystemError(200, 'Please Continue With Google and update password from setting');
        }
        if (userRecord.verified.isVerified === false) {
            throw new utils_1.SystemError(200, 'Account not verified, check your email to verify your account');
        }
        this.logger.silly('Checking password...');
        this.logger.silly(password);
        const validPassword = await argon2_1.default.verify(userRecord.password, password);
        if (validPassword) {
            this.logger.silly('Password is valid!');
            this.logger.silly('Generating Access and Refresh Tokens...');
            const { accessToken, refreshToken } = this.generateTokens(userRecord);
            // await this.creditDailySignInReward( { lastLogin: userRecord.lastLogin, userId: userRecord.id } );
            userRecord.lastLogin = new Date();
            await userRecord.save();
            const user = userRecord;
            console.log(user);
            const wallet = await this.walletModel.findById(user.wallet);
            return { user, accessToken, refreshToken, wallet };
        }
        else {
            throw new utils_1.SystemError(200, 'invalid username or password credentials');
        }
    }
    async VerifyMail({ token }) {
        const userRecord = await this.userModel.findOne({ 'verified.token.value': token });
        if (!userRecord) {
            throw new utils_1.SystemError(200, 'User not registered or the token has expired please, request a new one!');
        }
        if (!(userRecord === null || userRecord === void 0 ? void 0 : userRecord.verified.isVerified)) {
            userRecord.verified.isVerified = true;
            userRecord.verified.token.value = null;
            if (userRecord.referer) {
                await this.creditReferer(userRecord.referer);
            }
            await userRecord.save();
            return 'Your email has now been verified. Thank you for using our service';
        }
        else if (userRecord === null || userRecord === void 0 ? void 0 : userRecord.verified.isVerified) {
            return 'Your email has already been verified';
        }
    }
    async ResendVerification({ userId }) {
        const userRecord = await this.userModel.findById(userId);
        if (!userRecord) {
            throw new utils_1.SystemError(200, 'User not registered or the token has expired please, request a new one!');
        }
        if (!(userRecord === null || userRecord === void 0 ? void 0 : userRecord.verified.isVerified) && (userRecord === null || userRecord === void 0 ? void 0 : userRecord.verified.token.expires) > Date.now()) {
            await this.mailer.ResendVerificationMail(userRecord);
            this.eventDispatcher.dispatch(events_1.default.user.resendVerification, { user: userRecord });
            return userRecord.verified.token.value;
        }
        else if (userRecord === null || userRecord === void 0 ? void 0 : userRecord.verified.isVerified) {
            return 'Your email has already been verified';
        }
    }
    async ResendVerificationMail(email) {
        const userRecord = await this.userModel.findOne({ email });
        if (!userRecord) {
            throw new Error('Email not yet registered on this platform, make sure you entered the correct mail');
        }
        if (!(userRecord === null || userRecord === void 0 ? void 0 : userRecord.verified.isVerified)) {
            const salt = (0, crypto_1.randomBytes)(32);
            const saltHex = salt.toString('hex');
            userRecord.verified.token.value = saltHex.substr(2, 16);
            const userWithNewVerifyToken = await userRecord.save();
            await this.mailer.ResendVerificationMail(userWithNewVerifyToken);
            this.eventDispatcher.dispatch(events_1.default.user.resendVerification, { user: userWithNewVerifyToken });
            return 'check your mail, another verification link has been sent';
            //return userWithNewVerifyToken.verified.token.value;
        }
        else if (userRecord === null || userRecord === void 0 ? void 0 : userRecord.verified.isVerified) {
            throw new utils_1.SystemError(200, 'Your email has already been verified');
        }
    }
    async isUsed({ email }) {
        return await this.userModel.findOne({ email });
    }
    //
    async generateRefId(username) {
        try {
            const tokenPrefix = Math.floor(1000 + Math.random() * 9000); // this should be broken down to a helper function later
            const refId = (0, slugify_1.default)(`${username}${tokenPrefix}`);
            console.log("ref", refId);
            const user = await this.userModel.findOne({ refId });
            if (user) {
                return await this.generateRefId(username);
            }
            else {
                return refId.toLocaleLowerCase();
            }
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async millestoneCommision({ userId, dollar, reason }) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            return null;
        }
        this.logger.silly('giving daily login commission...');
        await this.wallet.credit({
            walletId: user.id,
            amount: dollar,
            type: 'Credit',
            status: "Completed",
            fee: 0,
            subject: user.id,
            subjectRef: 'User',
            reason: reason,
        });
        user.kpi.usersRefered = user.kpi.usersRefered.valueOf() + 1;
        await user.save();
        return user.id;
    }
    async creditReferer(refId) {
        const user = await this.userModel.findOne({ $or: [
                { refId: refId },
                { _id: refId }
            ] });
        if (!user) {
            console.log('user not found');
            return null;
        }
        console.log('user found', user);
        await this.millestoneCommision({ userId: user.id, dollar: 0.5, reason: 'Referal reward' });
        user.kpi.usersRefered = user.kpi.usersRefered.valueOf() + 1;
        await user.save();
        return user.id;
    }
    async creditDailySignInReward({ lastLogin, userId }) {
        if (!(0, utils_1.isToday)(lastLogin)) {
            await this.millestoneCommision({ userId: userId, dollar: 2.5, reason: 'daily signin reward' });
        }
    }
    async VerifyResetPasswordMail({ token }) {
        const userRecord = await this.userModel.findOne({ 'reset.token': token });
        if (!userRecord) {
            throw new utils_1.SystemError(200, 'User not registered or the token has expired please, request a new one!');
        }
        return 'valid reset password';
    }
    async RequestPasswordReset(email) {
        const userRecord = await this.userModel.findOne({ email });
        if (!userRecord) {
            this.logger.silly('user not found');
            return 'We have sent a password reset to the mail if it exists within our platform';
        }
        const resetToken = await (0, nanoid_1.nanoid)(15);
        userRecord.reset.token = resetToken;
        await userRecord.save();
        await this.mailer.SendPasswordResetMail(userRecord);
        // this.eventDispatcher.dispatch(events.user.resendVerification, { user: userRecord });
        return 'We have sent a password reset to the mail if it exists within our platform';
    }
    async UpdateRecord({ updateRecord, userId }) {
        const userRecord = await this.userModel.findById(userId);
        if (!userRecord) {
            this.logger.silly('user not found');
            throw new utils_1.SystemError(200, 'invalid Token');
        }
        for (const property in updateRecord) {
            userRecord[property] = updateRecord[property];
            // userRecord.oneTimeSetup = true;
        }
        return await userRecord.save();
    }
    async UpdatePassword(token, password) {
        const userRecord = await this.userModel.findOne({ 'reset.token': token });
        if (!userRecord) {
            this.logger.silly('user not found');
            throw new utils_1.SystemError(200, 'invalid token');
        }
        userRecord.password = await argon2_1.default.hash(password);
        userRecord.reset.token = null;
        userRecord.passwordSet = true;
        await userRecord.save();
        return 'Password reset successful';
    }
    async AuthedUpdatePassword(user, current, password) {
        try {
            const userRecord = await this.userModel.findById(user);
            if (!userRecord) {
                this.logger.silly('user not found');
                throw new utils_1.SystemError(404, 'user not found');
            }
            const validPassword = await argon2_1.default.verify(userRecord.password, current);
            if (!validPassword) {
                this.logger.silly('current password is invalid');
                throw new utils_1.SystemError(200, 'current password is invalid');
            }
            const samePassword = await argon2_1.default.verify(userRecord.password, password);
            if (samePassword)
                throw new utils_1.SystemError(404, 'new password is the same with the current password');
            userRecord.password = await argon2_1.default.hash(password);
            await userRecord.save();
            return 'Password reset successful';
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async RevokeRefreshTokens({ verifyPassword, userId, }) {
        this.logger.silly('Checking password...');
        const userRecord = await this.userModel.findById(userId);
        const validPassword = await argon2_1.default.verify(userRecord.password, verifyPassword);
        if (validPassword) {
            this.logger.silly('Password is valid!');
            this.logger.silly('Revoking refresh tokens...');
            userRecord.tokenVersion += 1;
            await userRecord.save();
            return 'Refresh tokens revoked';
        }
        else {
            throw new utils_1.SystemError(200, 'Invalid Password');
        }
    }
    async RenewRefreshToken({ user }) {
        this.logger.silly('Checking password...');
        const { accessToken, refreshToken } = this.generateTokens(user);
        return { accessToken, refreshToken };
    }
    async decodeRefreshToken({ token, }) {
        try {
            this.logger.silly(`Decoding refresh token: ${token}`);
            const decodedToken = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
            this.logger.silly(`Getting user with userId: ${decodedToken._id}...`);
            const userRecord = await this.userModel.findById(decodedToken._id);
            this.logger.silly('Extracting user tokenVersion...');
            // const user = userRecord.toObject();
            const user = userRecord;
            Reflect.deleteProperty(user, 'password');
            Reflect.deleteProperty(user, 'salt');
            return { clientTokenVersion: decodedToken.version, tokenVersion: user.tokenVersion, user };
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async finalAuth(userRecord) {
        try {
            this.logger.silly('Generating Access and Refresh Tokens...');
            const { accessToken, refreshToken } = this.generateTokens(userRecord);
            const user = userRecord;
            console.log(user);
            const wallet = await this.walletModel.findById(user.wallet);
            delete user._id;
            delete user.password;
            delete user.salt;
            return { user, accessToken, refreshToken, wallet };
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    generateTokens(user) {
        this.logger.silly(`Signing accessToken for userId: ${user._id}...`);
        const accessToken = jsonwebtoken_1.default.sign({
            _id: user._id,
            role: user.role,
            name: user.name,
        }, config_1.default.jwtSecret, { expiresIn: '15m' });
        this.logger.silly(`Signing refreshToken for userId: ${user._id}...`);
        const refreshToken = jsonwebtoken_1.default.sign({
            _id: user._id,
            version: user.tokenVersion,
        }, config_1.default.jwtSecret, { expiresIn: '1d' });
        return { accessToken, refreshToken };
    }
    async accountIsActivated(user) {
        try {
            this.logger.silly('geting user information');
            const userRecord = await this.userModel.findById(user);
            if (!userRecord) {
                this.logger.silly('user not found');
                throw new utils_1.SystemError(200, 'user not found');
            }
            return userRecord.oneTimeSetup;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async activateUser(user) {
        try {
            this.logger.silly('geting user information');
            const userRecord = await this.userModel
                .findById(user);
            if (!userRecord) {
                this.logger.silly('user not found');
                throw new utils_1.SystemError(200, 'user not found');
            }
            userRecord.oneTimeSetup = true;
            await userRecord.save();
            return userRecord.toJSON();
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async GetUser({ userId, }) {
        this.logger.silly('Getting Account...');
        try {
            const userRecord = await this.userModel.findById(userId);
            const wallet = await this.walletModel.findById(userRecord.wallet);
            if (userRecord) {
                this.logger.silly('Account Found!');
                return {
                    user: userRecord.toJSON(),
                    wallet
                };
            }
            else {
                throw new Error('unable to find this account at the moment, please try again later');
            }
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async GetUserKpi({ userId, }) {
        var _a, _b, _c, _d, _e, _f;
        this.logger.silly('Getting Account...');
        try {
            // total trade amount
            const totalTradesAmount = await this.tradeModel.aggregate([{
                    $match: { $and: [{ userId }, { status: 'ACTIVE' }] },
                }, {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount"
                        }
                    }
                }]);
            const totalTradesInterest = await this.tradeModel.aggregate([{
                    $match: { $and: [{ userId }, { status: 'ACTIVE' }] },
                }, {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$interest"
                        }
                    }
                }]);
            const totalAmountInSafe = await this.safeModel.aggregate([{
                    $match: { $and: [{ user: userId }, { status: 'active' }] },
                }, {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amountRaised"
                        }
                    }
                }]);
            const totalTradeRoi = (((_a = totalTradesAmount[0]) === null || _a === void 0 ? void 0 : _a.total) * ((_b = totalTradesInterest[0]) === null || _b === void 0 ? void 0 : _b.total)) / 100;
            const totalAmount = ((_c = totalTradesAmount[0]) === null || _c === void 0 ? void 0 : _c.total) + ((_d = totalAmountInSafe[0]) === null || _d === void 0 ? void 0 : _d.total);
            return {
                totalAmount,
                totalTrade: (_e = totalTradesAmount[0]) === null || _e === void 0 ? void 0 : _e.total,
                totalTradeRoi,
                totalSafe: (_f = totalAmountInSafe[0]) === null || _f === void 0 ? void 0 : _f.total,
            };
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async DeleteUser({ userId, }) {
        this.logger.silly('Deleting Account...');
        try {
            const userDeleted = await this.userModel.findByIdAndDelete(userId);
            if (userDeleted) {
                this.logger.silly('Account deleted!');
                return 'Your Account is permanently deleted';
            }
            else {
                throw new Error('this account is unable to delete at the moment, please try again later');
            }
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
};
AuthService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('userModel')),
    __param(1, (0, typedi_1.Inject)('walletModel')),
    __param(2, (0, typedi_1.Inject)('tradeModel')),
    __param(3, (0, typedi_1.Inject)('safeModel')),
    __param(6, (0, typedi_1.Inject)('logger')),
    __param(7, (0, eventDispatcher_1.EventDispatcher)()),
    __metadata("design:paramtypes", [Object, Object, Object, Object, mailer_1.MailerService,
        wallet_1.WalletService, Object, eventDispatcher_1.EventDispatcherInterface])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=index.js.map