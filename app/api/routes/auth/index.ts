import { Router } from 'express';
import middlewares, { validator } from '../../middlewares';
import { renewRefreshToken, revokeRefreshToken, UserController, AuthController } from '../../controllers';
// import { signin, signout, signup, renewRefreshToken, revokeRefreshToken } from '../controllers';

const authRouter = Router();

export default (app: Router): Router => {
  app.use('/auth', authRouter);

  //signup
  authRouter.route('/sign-up').post(validator.signup, AuthController.signup);

  //sigin
  authRouter.route('/sign-in').post(validator.signin, AuthController.signin);

  //Google Auth
  authRouter.route('/google-auth').post(validator.OAuth, AuthController.googleAuth);

  //verifyMail
  authRouter.route('/verify/:token').get(AuthController.verifyEmail);

  authRouter.route('/reset').post(validator.validateEmail, AuthController.requestPasswordReset);

  authRouter.route('/reset/:token').post(validator.validatePassword, AuthController.updatePassword);

  authRouter.route('/reset-password').post(validator.resetPassword, middlewares.isAuth, middlewares.attachCurrentUser, AuthController.authedUpdatePassword);

  // resend verification mail replacement
  authRouter.route('/resend-verify-mail').post(validator.validateEmail, AuthController.resendVerificationMail);

  // resendVerificationMail : depricated, didnt comment it out to avoid system break down
  authRouter
    .route('/resend-verify')
    .post(middlewares.isAuth, middlewares.attachCurrentUser, AuthController.resendVerification);

  //signout
  authRouter.route('/signout').post(AuthController.signout);

  //revoke-refresh
  authRouter.route('/revoke-refresh-token').post(middlewares.isAuth, middlewares.attachCurrentUser, revokeRefreshToken);

  //renew-refresh
  authRouter.route('/renew-refresh-token').post(middlewares.isAuth, middlewares.attachCurrentUser, renewRefreshToken);

  return app;
};