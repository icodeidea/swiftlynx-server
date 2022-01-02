import jwt from 'express-jwt';
import config from '../../config';

/**
 * JWT will come in a header with the form
 *
 * Authorization: Bearer ${JWT}
 */
const getTokenFromHeader = req => {
  const token = req.get('authorization');
  if (!token) {
    return null;
  }
  return token.substring(7);
};

const isAuth = jwt({
  secret: config.jwtSecret, // The _secret_ to sign the JWTs
  algorithms: [config.jwtAlgorithm], // JWT Algorithm
  userProperty: 'token', // Use req.token to store the JWT
  getToken: getTokenFromHeader, // How to extract the JWT from the request
});

export default isAuth;
