const environment = process.env.NODE_ENV; // development
const cookieName = process.env.COOKIE_NAME;
const cookieExp = process.env.COOKIE_EXP;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const stage = require('../config')[environment];
const { formatApiResponse } = require('../lib/formatters');
const User = require('../models/users');
const Event = require('../models/events');
const Token = require('../models/tokens');
const {
  NOT_ADDED,
  NOT_ADDED_DEV,
  NOT_FOUND_ERROR,
  NOT_FOUND_ERROR_DEV,
  FAILED_UPDATE_ERROR,
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
          // Set an initial state event.
          const event = new Event({
            userId: savedUser.id,
            description: 'User created',
            state: JSON.stringify({}),
          });
          event.save();
          result = formatApiResponse(201, null, user);
        }
        res.status(result.status).send(result);
      })
      .catch(error => UserController.onPassthruError(res, error));
  },

  /**
   * Read user method
   * Method used to retrieve a users information. Used for a profile-type page
   * @returns {Object} Your user data
   */
  read: (req, res) => {
    const { userId } = req.decoded;
    let result = {};

    User.findOne({ _id: userId })
      .then((user) => {
        if (!user) {
          result = formatApiResponse(500, {
            user: NOT_FOUND_ERROR,
            dev: NOT_FOUND_ERROR_DEV,
          }, {});
        } else {
          result = formatApiResponse(200, null, user);
        }
        res.status(result.status).send(result.data);
      })
      .catch((err) => {
        result = formatApiResponse(500, {
          user: NOT_FOUND_ERROR,
          dev: err,
        }, null);
        res.status(result.status).send(result);
      });
  },

  /**
   * Update user method
   * Method use to update a users info
   * @return {Object} The updates user.
   */
  update: (req, res) => {
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
  },

  /**
   * Login user method
   * Method used to log a user in
   * @param {String} name The users username
   * @param {String} password The users password
   * @returns {Object} The logged in user with JWT
   */
  login: (req, res) => {
    const { email, password } = req.body;
    let result = {};

    User.findOne({ email })
      .then((user) => {
        if (user) {
          bcrypt.compare(password, user.password)
            .then((match) => {
              if (match) {
                const payload = { username: user.name, userId: user.id, email };
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
  },

  /**
   * User logout method
   * Used to log a user out.
   */
  logout: (req, res) => {
    // Add the token to expired Tokens
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
