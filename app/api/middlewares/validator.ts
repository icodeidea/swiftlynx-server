import { Request, NextFunction } from 'express';
import { 
  AuthSchema, 
  FeedSchema, 
  CommentSchema, 
  WalletSchema,
  MarketSchema, 
  ProjectSchema,
  ContractShema,
  SafeSchema,
} from '../validations';

class Validator {
  async signup(req: Request, _, next: NextFunction) {
    try {
      const validation = AuthSchema.signupSchema.validate({
        ...req.body
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }

  async OAuth(req: Request, _, next: NextFunction) {
    try {
      const validation = AuthSchema.OAuthSchema.validate({
        token: req.body.token,
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }

  async signin(req: Request, _, next: NextFunction) {
    try {
      console.log(req.body);
      const validation = await AuthSchema.signinSchema.validateAsync({
        email: req.body.email,
        password: req.body.password,
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }

  async validateEmail(req: Request, _, next: NextFunction) {
    try {
      const validation = await AuthSchema.onlyEmailSchema.validateAsync({
        email: req.body.email,
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }

  async validatePassword(req: Request, _, next: NextFunction) {
    try {
      const validation = await AuthSchema.updatePasswordSchema.validateAsync({
        password: req.body.password,
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }

  async resetPassword(req: Request, _, next: NextFunction) {
    try {
      const validation = await AuthSchema.authedUpdatePasswordSchema.validateAsync({
        current: req.body.current,
        password: req.body.password,
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }

  async createFeed(req: Request, _, next: NextFunction) {
    try {
      const validation = FeedSchema.createFeedSchema.validate({
        ...req.body
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }

  async createComment(req: Request, _, next: NextFunction) {
    try {
      const validation = CommentSchema.createCommentSchema.validate({
        ...req.body
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }

  async updateUser(req: Request, _, next: NextFunction) {
    try {
      const validation = await AuthSchema.userUpdateSchema.validateAsync({
       ...req.body
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }

  async updatePassword(req: Request, _, next: NextFunction) {
    try {
      const validation = await AuthSchema.authedUpdatePasswordSchema.validateAsync({
       ...req.body
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }


  /**
   * Wallet Validators
   */
   async walletActivation(req: Request, _, next: NextFunction) {
    try {
      const validation = WalletSchema.activation.validate({
        ...req.body
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }

  async withdrawFund(req: Request, _, next: NextFunction) {
    try {
      const validation = WalletSchema.withdrawalSchema.validate({
        ...req.body
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }

  /**
   * Market Validators
   */

  async addMarket(req: Request, _, next: NextFunction) {
    try {
      const validation = MarketSchema.addMarketSchema.validate({
        ...req.body
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }

  /**
   *  project Validators
   */

   async startProject(req: Request, _, next: NextFunction) {
    try {
      const validation = ProjectSchema.startProjectSchema.validate({
        ...req.body
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }

  async updateProject(req: Request, _, next: NextFunction) {
    try {
      const validation = ProjectSchema.updateProjectSchema.validate({
        ...req.body
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }

  async deleteProject(req: Request, _, next: NextFunction) {
    try {
      const validation = ProjectSchema.deleteProjectSchema.validate({
        ...req.body
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }

  

  /**
   * contract validators
   */

   async addContract(req: Request, _, next: NextFunction) {
    try {
      const validation = ContractShema.addContractSchema.validate({
        ...req.body
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }

  async updateContract(req: Request, _, next: NextFunction) {
    try {
      const validation = ContractShema.updateContractSchema.validate({
        ...req.body
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }


  async signContract(req: Request, _, next: NextFunction) {
    try {
      const validation = ContractShema.signContractSchema.validate({
        ...req.body
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }

  async deleteContract(req: Request, _, next: NextFunction) {
    try {
      const validation = ContractShema.getContractSchema.validate({
        ...req.body
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }

  /// safe 
  async createSafe(req: Request, _, next: NextFunction) {
    try {
      const validation = SafeSchema.createSafeSchema.validate({
        ...req.body
      });
      if (validation.error) {
        return next(validation.error);
      }
      return next();
    } catch (e) {
      next(e);
    }
  }
  

}

const validator = new Validator();
export default validator;
