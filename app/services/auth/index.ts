import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import { MailerService } from '../mailer';
import { WalletService } from '../wallet';
import config from '../../config';
import { nanoid } from 'nanoid';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser, IUserInputDTO, IUserUpdateDTO } from '../../interfaces';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/eventDispatcher';
import events from '../../subscribers/events';
import { SystemError, isToday } from '../../utils';
import { Document } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import slugify from 'slugify';

@Service()
export class AuthService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('walletModel') private walletModel: Models.WalletModel,
    @Inject('tradeModel') private tradeModel: Models.TradeModel,
    @Inject('safeModel') private safeModel: Models.SafeModel,
    @Inject('contractModel') private contractModel: Models.ContractModel,
    private mailer: MailerService,
    private wallet: WalletService,
    @Inject('logger') private logger: { silly(arg0: string): void; error(arg0: unknown): void },
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async SignUp(userInputDTO: IUserInputDTO): Promise<string> {
    try {
      console.log(userInputDTO);
      // throw new SystemError(401, 'System under maintenance, try again later');

      const exists = await this.isUsed({ email: userInputDTO.email });
      if (exists) {
        throw new SystemError(401, 'email or username already in use');
      }
      if(userInputDTO?.referer){
        const refUser = await this.userModel.findOne({refId: userInputDTO.referer});
        if(refUser){
          userInputDTO.referer = refUser.id;
        }
      }

      const salt = randomBytes(32);
      this.logger.silly('Hashing password...');

      const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
      this.logger.silly('Creating user db record');

      const saltHex = salt.toString('hex');
      const refId = await this.generateRefId(userInputDTO.username);

      const userRecord = await this.userModel.create({
        ...userInputDTO,
        username: `${userInputDTO.firstname}-${userInputDTO.lastname}`,
        refId,
        salt: salt.toString('hex'),
        password: hashedPassword,
        oneTimeSetup: true,
        verified: {
          token: {
            value: Math.floor(1000 + Math.random() * 9000) // saltHex.substr(2, 16),
          },
        },
      });
      const walletRecord = await this.walletModel.create({
        user: userRecord.id,
      });
      userRecord.wallet = walletRecord.id;
      await userRecord.save();
      if (!userRecord) {
        throw new SystemError(500, 'User cannot be created');
      }
      this.logger.silly('Generating JWT...');
      this.logger.silly('Welcome Email will be sent at this point...');
      await this.mailer.SendWelcomeEmail(userRecord);
      this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord });
      // await this.millestoneCommision({userId : userRecord.id, dollar: 0.11, reason: 'signup reward'});

      return 'Account Created, Verification email has been sent';
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async GoogleAuth({ token, refCode } : { token : string, refCode : string }): Promise<{ user: IUser; accessToken: string; refreshToken: string; wallet?: {} }> {
    try {
      const gooleClient = new OAuth2Client(config.googleClientID);
      const ticket = await gooleClient.verifyIdToken({
        idToken: token,
        audience: config.googleClientID
      });
      const { name, email, picture } = ticket.getPayload();
      console.log('this is email', email);
      const exists = await this.isUsed({ email: email });
      if (exists) {
        return this.finalAuth(exists);
      }

      throw new SystemError(401, 'System under maintenance, try again later');

      const salt = randomBytes(32);
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
      if(referer){
        userRecord.referer = referer;
      }
      await this.millestoneCommision({userId : userRecord.id, dollar: 0.11, reason: 'signup reward'});
      await userRecord.save();
      if (!userRecord) {
        throw new SystemError(500, 'User cannot be created');
      }
      return this.finalAuth(userRecord);
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async SignIn({
    email,
    password,
  }: {
    email: string;
    password: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
  }): Promise<{ user: IUser; accessToken: string; refreshToken: string; wallet?: {} }> {
    const userRecord = await this.isUsed({ email });
    if (!userRecord) {
      throw new SystemError(200, 'invalid username or password credentials');
    }
    if (!userRecord.passwordSet) {
      throw new SystemError(200, 'Please Continue With Google and update password from setting');
    }
    if (userRecord.verified.isVerified === false) {
      throw new SystemError(200, 'Account not verified, check your email to verify your account');
    }

    this.logger.silly('Checking password...');
    this.logger.silly(password);
    const validPassword = await argon2.verify(userRecord.password, password);
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
    } else {
      throw new SystemError(200, 'invalid username or password credentials');
    }
  }

  public async VerifyMail({ token }: { token: string }): Promise<string> {
    const userRecord = await this.userModel.findOne({ 'verified.token.value': token });
    if (!userRecord) {
      throw new SystemError(200, 'User not registered or the token has expired please, request a new one!');
    }
    if (!userRecord?.verified.isVerified) {
      userRecord.verified.isVerified = true;
      userRecord.verified.token.value = null;
      // if(userRecord.referer){
      //   await this.creditReferer(userRecord.referer);
      // }
      await userRecord.save();
      return 'Your email has now been verified. Thank you for using our service';
    } else if (userRecord?.verified.isVerified) {
      return 'Your email has already been verified';
    }
  }

  public async ResendVerification({ userId }: { userId: string }): Promise<(IUser & Document) | string> {
    const userRecord = await this.userModel.findById(userId);
    if (!userRecord) {
      throw new SystemError(200, 'User not registered or the token has expired please, request a new one!');
    }
    if (!userRecord?.verified.isVerified && userRecord?.verified.token.expires > Date.now()) {
      await this.mailer.ResendVerificationMail(userRecord);
      this.eventDispatcher.dispatch(events.user.resendVerification, { user: userRecord });
      return userRecord.verified.token.value;
    } else if (userRecord?.verified.isVerified) {
      return 'Your email has already been verified';
    }
  }

  public async ResendVerificationMail(email: string): Promise<(IUser & Document) | string> {
    const userRecord = await this.userModel.findOne({ email });
    if (!userRecord) {
      throw new Error('Email not yet registered on this platform, make sure you entered the correct mail');
    }
    if (!userRecord?.verified.isVerified) {
      const salt = randomBytes(32);
      const saltHex = salt.toString('hex');

      userRecord.verified.token.value = `${Math.floor(1000 + Math.random() * 9000)}` // saltHex.substr(2, 16);

      const userWithNewVerifyToken = await userRecord.save();

      await this.mailer.ResendVerificationMail(userWithNewVerifyToken);
      this.eventDispatcher.dispatch(events.user.resendVerification, { user: userWithNewVerifyToken });
      return 'check your mail, another verification link has been sent';
      //return userWithNewVerifyToken.verified.token.value;
    } else if (userRecord?.verified.isVerified) {
      throw new SystemError(200, 'Your email has already been verified');
    }
  }

  private async isUsed({ email }: { email: string }) {
    return await this.userModel.findOne({ email });
  }

  //
  private async generateRefId(username :string )  : Promise<string>  {
    try {
      const tokenPrefix = Math.floor(1000 + Math.random() * 9000); // this should be broken down to a helper function later
      const refId = slugify(`${username}${tokenPrefix}`);
      console.log("ref",refId);
      const user =  await this.userModel.findOne({ refId });
      if(user){
        return await this.generateRefId( username );
      } else {
        return refId.toLocaleLowerCase();
      }
    } catch (e) {
        this.logger.error(e);
        throw new SystemError(e.statusCode || 500, e.message);
    }
    
  }

  private async millestoneCommision( {userId, dollar, reason} : { userId: string, dollar: number, reason: string} ) : Promise<string> {
    const user = await this.userModel.findById(userId);
    if(!user){
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

  private async creditReferer( refId : string ) : Promise<string> {
    const user = await this.userModel.findOne({$or: [
      { refId:  refId},
      {_id: refId}
    ]});
    if(!user){
        console.log('user not found')
        return null;
    }
    console.log('user found', user);

     await this.millestoneCommision( {userId : user.id, dollar: 0.5, reason: 'Referal reward'});

     user.kpi.usersRefered = user.kpi.usersRefered.valueOf() + 1;
     await user.save();

     return user.id;

  }

  private async creditDailySignInReward( { lastLogin, userId } : { lastLogin : Date, userId: string } ) : Promise<void> {
    if(!isToday(lastLogin)){
      await this.millestoneCommision( {userId : userId, dollar: 2.5, reason: 'daily signin reward'});
    }

  }

  public async VerifyResetPasswordMail({ token }: { token: string }): Promise<string> {
    const userRecord = await this.userModel.findOne({ 'reset.token': token });
    if (!userRecord) {
      throw new SystemError(200, 'User not registered or the token has expired please, request a new one!');
    }
    return 'valid reset password';
  }

  public async RequestPasswordReset(email: string): Promise<(IUser & Document) | string> {
    const userRecord = await this.userModel.findOne({ email });
    if (!userRecord) {
      this.logger.silly('user not found');
      return 'We have sent a password reset to the mail if it exists within our platform';
    }
    const resetToken = await nanoid(15);
    userRecord.reset.token = resetToken;
    await userRecord.save();
    await this.mailer.SendPasswordResetMail(userRecord);
    // this.eventDispatcher.dispatch(events.user.resendVerification, { user: userRecord });
    return 'We have sent a password reset to the mail if it exists within our platform';
  }

  public async UpdateRecord({ updateRecord, userId }: { updateRecord: IUserUpdateDTO, userId: String }): Promise<(IUser & Document) | string> {
    const userRecord = await this.userModel.findById(userId);
    if (!userRecord) {
      this.logger.silly('user not found');
      throw new SystemError(200, 'invalid Token');
    }
    for (const property in updateRecord) {
      userRecord[property] = updateRecord[property];
      // userRecord.oneTimeSetup = true;
    }
    
    return await userRecord.save();
  }

  public async UpdatePassword(token: string, password: string): Promise<(IUser & Document) | string> {
    const userRecord = await this.userModel.findOne({ 'reset.token': token });
    if (!userRecord) {
      this.logger.silly('user not found');
      throw new SystemError(200, 'invalid token');
    }
    userRecord.password = await argon2.hash(password);
    userRecord.reset.token = null;
    userRecord.passwordSet = true;
    await userRecord.save();
    return 'Password reset successful';
  }

  public async AuthedUpdatePassword(user: string, current: string, password: string): Promise<(IUser & Document) | string> {
    try{
      const userRecord = await this.userModel.findById(user);
      if (!userRecord) {
        this.logger.silly('user not found');
        throw new SystemError(404, 'user not found');
      }

      const validPassword = await argon2.verify(userRecord.password, current);
      if (!validPassword) { 
        this.logger.silly('current password is invalid');
        throw new SystemError(200, 'current password is invalid');
      }

      const samePassword = await argon2.verify(userRecord.password, password);
      if(samePassword) throw new SystemError(404, 'new password is the same with the current password');
    
      userRecord.password = await argon2.hash(password);
      await userRecord.save();
      return 'Password reset successful';

    } catch (e) {
        this.logger.error(e);
        throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async RevokeRefreshTokens({
    verifyPassword,
    userId,
  }: {
    verifyPassword: string;
    userId: string;
  }): Promise<string> {
    this.logger.silly('Checking password...');

    const userRecord = await this.userModel.findById(userId);
    const validPassword = await argon2.verify(userRecord.password, verifyPassword);
    if (validPassword) {
      this.logger.silly('Password is valid!');
      this.logger.silly('Revoking refresh tokens...');

      userRecord.tokenVersion += 1;

      await userRecord.save();

      return 'Refresh tokens revoked';
    } else {
      throw new SystemError(200, 'Invalid Password');
    }
  }

  public async RenewRefreshToken({ user }: { user: IUser }): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.silly('Checking password...');

    const { accessToken, refreshToken } = this.generateTokens(user);
    return { accessToken, refreshToken };
  }

  public async decodeRefreshToken({
    token,
  }: {
    token: string;
  }): Promise<{ tokenVersion: number; clientTokenVersion: number; user: IUser }> {
    try {
      this.logger.silly(`Decoding refresh token: ${token}`);
      const decodedToken = jwt.verify(token, config.jwtSecret);
      this.logger.silly(`Getting user with userId: ${decodedToken._id}...`);
      const userRecord = await this.userModel.findById(decodedToken._id);

      this.logger.silly('Extracting user tokenVersion...');
      // const user = userRecord.toObject();
      const user = userRecord;

      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      return { clientTokenVersion: decodedToken.version, tokenVersion: user.tokenVersion, user };
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  private async finalAuth(userRecord: IUser) : Promise<{ user: IUser; accessToken: string; refreshToken: string; wallet?: {} }>  {
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
    }catch(e){
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  private generateTokens(user) {
    this.logger.silly(`Signing accessToken for userId: ${user._id}...`);
    const accessToken = jwt.sign(
      {
        _id: user._id, // We are gonna use this in the middleware 'isAuth'
        role: user.role,
        name: user.name,
      },
      config.jwtSecret,
      { expiresIn: '15m' },
    );

    this.logger.silly(`Signing refreshToken for userId: ${user._id}...`);

    const refreshToken = jwt.sign(
      {
        _id: user._id, // We are gonna use this in the middleware 'isAuth'
        version: user.tokenVersion,
      },
      config.jwtSecret,
      { expiresIn: '1d' },
    );

    return { accessToken, refreshToken };
  }

  public async accountIsActivated(user: string): Promise<(IUser & Document) | any> {
    try {
      this.logger.silly('geting user information');
      const userRecord = await this.userModel.findById(user);
      if (!userRecord) {
        this.logger.silly('user not found');
        throw new SystemError(200, 'user not found');
      }
      return userRecord.oneTimeSetup;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async activateUser(user: string): Promise<(IUser & Document) | any> {
    try {
      this.logger.silly('geting user information');
      const userRecord = await this.userModel
        .findById(user)
      if (!userRecord) {
        this.logger.silly('user not found');
        throw new SystemError(200, 'user not found');
      }
      userRecord.oneTimeSetup = true;
      await userRecord.save();
      return userRecord.toJSON();
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async GetUser({
    userId,
  }: {
    userId: string;
  }): Promise<(IUser & Document) | any> {
    this.logger.silly('Getting Account...');
    try {
      const userRecord = await this.userModel.findById(userId);
      const wallet = await this.walletModel.findById(userRecord.wallet);
      if(userRecord) {
        this.logger.silly('Account Found!');
        return {
          user: userRecord.toJSON(),
          wallet
        }
      }else{
        throw new Error('unable to find this account at the moment, please try again later');
      }
    } catch(e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async FilterUsers({
    key,
    value
  }: {
    key: any;
    value: any;
  }): Promise<(IUser & Document) | any> {
    this.logger.silly('Getting Accounts...');
    const params = key && value ? {[key]: value} : {};
    try {
      return await this.userModel.find(params).populate("wallet").sort({createdAt: -1});
      // const wallet = await this.walletModel.findById(userRecord.wallet);
      // if(userRecord) {
      //   this.logger.silly('Account Found!');
      //   return {
      //     user: userRecord.toJSON(),
      //     wallet
      //   }
      // }else{
      //   throw new Error('unable to find this account at the moment, please try again later');
      // }
    } catch(e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async GetUserKpi({
    userId,
  }: {
    userId: string;
  }): Promise<(IUser & Document) | any> {
    this.logger.silly('Getting Account...');
    try {
      // total trade amount
      const totalTradesAmount = await this.tradeModel.aggregate([{
        $match : { $and : [ {userId}, {status: 'ACTIVE' }] },
      },{
          $group : {
              _id : null,
              total : {
                  $sum : "$amount"
              }
          }
      }]);

      const totalTradesInterest = await this.tradeModel.aggregate([{
        $match : { $and : [ {userId}, {status: 'ACTIVE' }] },
      },{
          $group : {
              _id : null,
              total : {
                  $sum : "$interest"
              }
          }
      }]);

      const totalAmountInSafe = await this.safeModel.aggregate([{
        $match : { $and : [ { user: userId }, { status: 'active' }] },
      },{
          $group : {
              _id : null,
              total : {
                  $sum : "$amountRaised"
              }
          }
      }]);

      // get total loan amount
      const totalActiveLoansAmount = await this.contractModel.aggregate([{
        $match : { $and : [ { user: userId }, {state: 'PENDING' } ] },
      },{
          $group : {
              _id : null,
              total : {
                  $sum : "$fixedAmount"
              }
          }
      }]);

      const totalTradeRoi: any = (totalTradesAmount[0]?.total * totalTradesInterest[0]?.total) / 100
      const totalAmount = totalTradesAmount[0]?.total || 0 + totalAmountInSafe[0]?.total || 0;

      return {
        totalAmount: totalAmount || 0,
        totalTrade: totalTradesAmount[0]?.total || 0,
        totalTradeRoi: totalTradeRoi || 0, 
        totalSafe: totalAmountInSafe[0]?.total || 0,
        totalDebt: totalActiveLoansAmount[0]?.total || 0
      }
    } catch(e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async DeleteUser({
    userId,
  }: {
    userId: string;
  }): Promise<string> {
    this.logger.silly('Deleting Account...');

    
    try {
      const userDeleted = await this.userModel.findByIdAndDelete(userId);
      if(userDeleted) {
        this.logger.silly('Account deleted!');
        return 'Your Account is permanently deleted';
      }else{
        throw new Error('this account is unable to delete at the moment, please try again later');
      }
      
    } catch(e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }
}