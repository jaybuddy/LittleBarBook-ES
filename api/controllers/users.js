const environment = process.env.NODE_ENV; // development
const cookieName = process.env.COOKIE_NAME;
const cookieExp = process.env.COOKIE_EXP;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const stage = require('../config')[environment];
const connUri = require('../lib/database');
const { formatApiResponse } = require('../lib/formatters');
const User = require('../models/users');
const Token = require('../models/tokens');
const {
  NOT_ADDED,
  NOT_ADDED_DEV,
  NOT_FOUND_ERROR,
  NOT_FOUND_ERROR_DEV,
  FAILED_UPDATE_ERROR,
  FAILED_TO_CONNECT,
  AUTHENTICATION_ERROR,
} = require('../constants/users');
const {
  NOT_ADDED_T,
  NOT_ADDED_DEV_T,
} = require('../constants/tokens');

const UserController = {
  /**
   * Create user method
   * Used to add a new user. (register)
   * @param {String} name The users username
   * @param {String} password The users password
   * @param {String} email The users email address
   * @returns {Object} The users registered information
   */
  create: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true })
      .then(() => {
        const { name, password, email } = req.body;
        const user = new User({ name, password, email });
        let result = {};
        user.save()
          .then((savedUser) => {
            if (!savedUser) {
              result = formatApiResponse(500, {
                user: NOT_ADDED,
                dev: NOT_ADDED_DEV,
              }, {});
            } else {
              result = formatApiResponse(201, null, user);
            }
            res.status(result.status).send(result);
          })
          .catch(error => UserController.onPassthruError(res, error));
      })
      .catch(() => UserController.onNoConnection(res));
  },

  /**
   * Read user method
   * Method used to retrieve a users information. Used for a profile-type page
   * @returns {Object} Your user data
   */
  read: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true })
      .then(() => {
        const { id } = req.decoded;
        let result = {};

        User.findOne({ _id: id })
          .then((user) => {
            if (!user) {
              result = formatApiResponse(500, {
                user: NOT_FOUND_ERROR,
                dev: NOT_FOUND_ERROR_DEV,
              }, {});
            } else {
              result = formatApiResponse(200, null, user);
            }
            res.status(result.status).send(result);
          })
          .catch((err) => {
            result = formatApiResponse(500, {
              user: NOT_FOUND_ERROR,
              dev: err,
            }, null);
            res.status(result.status).send(result);
          });
      })
      .catch(() => UserController.onNoConnection(res));
  },

  /**
   * Update user method
   * Method use to update a users info
   * @return {Object} The updates user.
   */
  update: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true })
      .then(() => {
        const { id } = req.decoded;
        let result = {};

        User.findOneAndUpdate({ _id: id }, req.body, { new: true })
          .then((user) => {
            result = formatApiResponse(200, null, user);
            res.status(result.status).send(result);
          })
          .catch((err) => {
            result = formatApiResponse(500, {
              user: FAILED_UPDATE_ERROR,
              dev: err,
            }, null);
            res.status(result.status).send(result);
          });
      })
      .catch(() => UserController.onNoConnection(res));
  },

  /**
   * Login user method
   * Method used to log a user in
   * @param {String} name The users username
   * @param {String} password The users password
   * @returns {Object} The logged in user with JWT
   */
  login: (req, res) => {
    const { name, password } = req.body;
    mongoose.connect(connUri, { useNewUrlParser: true })
      .then(() => {
        let result = {};

        User.findOne({ name })
          .then((user) => {
            if (user) {
              bcrypt.compare(password, user.password)
                .then((match) => {
                  if (match) {
                    const payload = { username: user.name, userId: user.id, bbId: user.bbId };
                    const options = { expiresIn: stage.jwt.expires, issuer: stage.jwt.issuer };
                    const secret = process.env.JWT_SECRET;
                    const token = jwt.sign(payload, secret, options);

                    // Set the token in a cookie.
                    res.cookie(cookieName, { token }, {
                      httpOnly: true,
                      maxAge: cookieExp,
                    });

                    result = formatApiResponse(201, null, user);
                  } else {
                    result = formatApiResponse(401, {
                      user: AUTHENTICATION_ERROR,
                      dev: AUTHENTICATION_ERROR,
                    }, null);
                  }
                  res.status(result.status).send(result);
                })
                .catch(error => UserController.onPassthruError(res, error));
            } else {
              result = formatApiResponse(500, {
                user: NOT_FOUND_ERROR,
                dev: NOT_FOUND_ERROR_DEV,
              }, {});
              res.status(result.status).send(result);
            }
          })
          .catch(error => UserController.onPassthruError(res, error));
      })
      .catch(() => UserController.onNoConnection(res));
  },

  /**
   * User logout method
   * Used to log a user out.
   */
  logout: (req, res) => {
    // Add the token to expired Tokens
    mongoose.connect(connUri, { useNewUrlParser: true })
      .then(() => {
        const { token } = req.cookies[cookieName];
        const newToken = new Token({
          token,
          createdAt: new Date(),
        });
        let result = {};

        newToken.save()
          .then((savedToken) => {
            if (!savedToken) {
              result = formatApiResponse(500, {
                user: NOT_ADDED_T,
                dev: NOT_ADDED_DEV_T,
              }, {});
            } else {
              res.clearCookie(cookieName);
              result = formatApiResponse(200, null, savedToken);
            }
            res.status(result.status).send(result);
          })
          .catch(error => UserController.onPassthruError(res, error));
      })
      .catch(() => UserController.onNoConnection(res));
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

module.exports = UserController;
