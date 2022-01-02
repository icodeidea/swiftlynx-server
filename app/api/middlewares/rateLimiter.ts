import { Container } from 'typedi';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { AccessService } from '../../services';
import config from '../../config';

const rateLimiterBasic = new RateLimiterMemory({
  points: config.apiLevel.basic.points, // Five maximum calls
  duration: config.apiLevel.basic.duration, // per second
});

const rateLimiterPro = new RateLimiterMemory({
  points: config.apiLevel.pro.points, // Five maximum calls
  duration: config.apiLevel.pro.duration, // per second
});

const rateLimiterMiddleware = async (req, res, next) => {
  try {
    const accessServiceInstance = Container.get(AccessService);
    const { plan, active } = await accessServiceInstance.identifyAPIForLimiter({
      providedKey: req.apiKey,
    });

    if (!active) {
      return res.status(401).json({ success: false, data: {}, message: 'The provided apiKey is currently inactive' });
    }

    if (plan === 'BASIC') {
      await rateLimiterBasic.consume(req.ip, 1);
    } else if (plan === 'PRO') {
      await rateLimiterPro.consume(req.ip, 1);
    }

    return next();
  } catch (e) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests',
    });
  }
};

export default rateLimiterMiddleware;
