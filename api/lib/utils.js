const environment = process.env.NODE_ENV; // development
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const stage = require('../config')[environment];
const Token = require('../models/tokens');
const connUri = require('../lib/database');

module.exports = {

  /**
   * removeBearer
   * Utility method for removing bearer
   */
  removeBearer: (authHeader) => {
    return (authHeader) ? authHeader.split(' ').pop() || '' : '';
  },

  /**
   * validateToken
   * Method validates an incoming JWT
   */
  validateToken: (req, res, next) => {
    const { authorization: authHeader } = req.headers;
    const token = module.exports.removeBearer(authHeader);

    let result;
    if (token) {
      // Look if token is in expired tokens, if so, throw 401
      mongoose.connect(connUri, { useNewUrlParser: true })
        .then(() => {
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
        });
    } else {
      result = {
        error: 'Authentication error. No token provided.',
        status: 401,
      };
      res.status(401).send(result);
    }
  },

  /**
   * randomHash
   * Method generates a rondom has (currently used to generate a bbId)
   * @param {Int} length Length of the hash
   * @returns {String} A hash string.
   */
  randomHash: (length) => {
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let hash = '';

    for (let i = 0; i < length; i++) {
      hash += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return hash;
  },
};
