const mongoose = require('mongoose');
const Drink = require('../models/tokens');
const { formatApiResponse } = require('../lib/formatters');
const connUri = require('../lib/database');
const {
  NOT_ADDED,
  NOT_ADDED_DEV,
  FAILED_TO_CONNECT,
} = require('../constants/tokens');

const TokenController = {
  /**
   * Create Token Method
   * Adds a token to the "expiredTokens" table
   * @returns {Object} The saved drink data.
   */
  create: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true })
      .then(() => {
        const {
          decoded: { userId },
          body: { tokenToExpire },
        } = req;
        
        const token = new Token({
          token: tokenToExpire,
          createdAt: new Date(),
        });
        let result = {};
        
        token.save()
          .then((savedToken) => {
            if (!savedToken) {
              result = formatApiResponse(500, {
                user: NOT_ADDED,
                dev: NOT_ADDED_DEV,
              }, {});
            } else {
              result = formatApiResponse(201, null, savedToken);
            }
            res.status(result.status).send(result);
          })
          .catch(error => DrinkController.onPassthruError(res, error));
      })
      .catch(() => DrinkController.onNoConnection(res));
  },

  /**
   * onNoConnection
   * Helper function that sends the no connection error
   * @param {Object} res The response object
   */
  onNoConnection: (res) => {
    const result = formatApiResponse(500, {
      user: FAILED_TO_CONNECT,
      dev: FAILED_TO_CONNECT,
    }, null);
    res.status(result.status).send(result);
  },

  /**
   * onPassthruError
   * Helper function that sends an error
   * @param {Object} res The response object
   * @param {Object} error The error to be sent
   */
  onPassthruError: (res, error) => {
    const result = formatApiResponse(500, error, null);
    res.status(result.status).send(result);
  },
};

module.exports = TokenController;
