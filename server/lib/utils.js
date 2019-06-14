const environment = process.env.NODE_ENV; // development
const jwt = require('jsonwebtoken');
const stage = require('../../config')[environment];
const Token = require('../models/tokens');

const cookieName = process.env.COOKIE_NAME;

module.exports = {
  isLoggedin: (req) => {
    const atoken = (req && req.cookies[cookieName]) ? req.cookies[cookieName].token : undefined;

    if (atoken) {
      // Look if token is in expired tokens, if so, throw 401
      Token.findOne({ atoken })
        .then((foundToken) => {
          if (foundToken) return false;

          // Good to go, verify the token
          const options = {
            expiresIn: stage.jwt.expires,
            issuer: stage.jwt.issuer,
          };
          try {
            const result = jwt.verify(atoken, process.env.JWT_SECRET, options);
            if (result._id) return true;
          } catch (err) {
            return false;
          }
        });
    }
    return false;
  },

  /**
   * validateToken
   * Method validates an incoming JWT
   */
  validateToken: (req, res, next) => {
    // const { authorization: authHeader } = req.headers;
    const token = (req && req.cookies[cookieName]) ? req.cookies[cookieName].token : undefined;
    let result;

    if (token) {
      // Look if token is in expired tokens, if so, throw 401
      Token.findOne({ token })
        .then((foundToken) => {
          if (foundToken) {
            result = {
              error: 'Authentication error. Token has been invalidated',
              status: 401,
            };
            res.status(result.status).end(result);
          } else {
            // Good to go, verify the token
            const options = {
              expiresIn: stage.jwt.expires,
              issuer: stage.jwt.issuer,
            };
            try {
              result = jwt.verify(token, process.env.JWT_SECRET, options);
              req.decoded = result;
              next();
            } catch (err) {
              throw new Error(err);
            }
          }
        });
    } else {
      result = {
        error: 'Not logged in',
        status: 200,
      };
      res.status(200).send(result);
    }
  },
};
