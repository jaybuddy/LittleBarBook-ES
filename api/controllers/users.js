const environment = process.env.NODE_ENV; // development
const stage = require('../config')[environment];
const { formatApiResponse } = require('../lib/formatters');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const connUri = process.env.MONGO_LOCAL_CONN_URL;
const { 
  NOT_ADDED,
  NOT_ADDED_DEV,
  NOT_FOUND_ERROR, 
  NOT_FOUND_ERROR_DEV,
  ID_NOT_PROVIDED,
  FAILED_UPDATE_ERROR,
} = require('../constants/users');

module.exports = {
  /**
   * Create user method
   * Used to add a new user. (register)
   * @param {String} name The users username
   * @param {String} password The users password
   * @param {String} email The users email address
   * @returns {Object} The users registered information
   */
  create: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser : true }, (err) => {
      let result = {};
      let status = 200;
      if (!err) {
        const { name, password, email } = req.body;
        const user = new User({ name, password, email }); // document = instance of a model
        User.save()
          .then(user => {
            if (!user) {
              result = formatApiResponse(500, {
                user: NOT_ADDED,
                dev: NOT_ADDED_DEV
              }, {});
            } else {
              result = formatApiResponse(status, null, drink)
            }
            res.status(result.status).send(result);
          })
          .catch(err => {
            result = formatApiResponse(500, err, null);
            res.status(result.status).send(result);
          });
      } else {
        result = formatApiResponse(500, err, null);
        res.status(result.status).send(result);
      }
    });
  },

  /**
   * Read user method
   * Method used to retrieve a users information. Used for a profile-type page
   * @returns {Object} Your user data
   */
  read: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
      let result = {};
      let status = 200;
      if (!err) {
        const {id} = req.decoded;
        User.findOne({ _id: id })
          .then(user => {
            if (!user) {
              result = formatApiResponse(500, {
                user: NOT_FOUND_ERROR,
                dev: NOT_FOUND_ERROR_DEV
              }, {});
            } else {
              result = formatApiResponse(status, null, drink)
            }
            res.status(result.status).send(result);
          })
          .catch(err => {
            result = formatApiResponse(500, {
              user: NOT_FOUND_ERROR,
              dev: err
            }, null);
            res.status(result.status).send(result);
          });
      } else {
        result = formatApiResponse(500, {
          user: NOT_FOUND_ERROR,
          dev: ID_NOT_PROVIDED
        }, null);
        res.status(result.status).send(result);
      }
    });
  },

  /**
   * Update user method
   * Method use to update a users info
   * @return {Object} The updates user.
   */
  update: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
      let result = {};
      let status = 200;
      if (!err) {
        const { id } = req.decoded;
        User.findOneAndUpdate({ _id: id }, req.body, { new: true })
          .then(user => {
            result = formatApiResponse(status, null, drink);
            res.status(status).send(result);
          })
          .catch(err => {
            result = formatApiResponse(500, {
              user: FAILED_UPDATE_ERROR,
              dev: err
            }, null);
            res.status(result.status).send(result);
          }); 
      } else {
        result = formatApiResponse(500, err, null);
        res.status(result.status).send(result);
      }
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
    const { name, password } = req.body;
    mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
      let result = {};
      let status = 200;
      if(!err) {
        User.findOne({name}, (err, user) => {
          if (!err && user) {
            // We could compare passwords in our model instead of below as well
            bcrypt.compare(password, user.password).then(match => {
              if (match) {
                status = 200;
                // Create a token
                const payload = { 
                  id: user._id,
                  username: user.name,
                  bbId: user.bbId, 
                  userId: user.id,
                  role: user.role,
                };
                const options = { expiresIn: stage.jwt.expires, issuer: stage.jwt.issuer };
                const secret = process.env.JWT_SECRET;
                const token = jwt.sign(payload, secret, options);

                result.token = token;
                result.status = status;
                result.result = user;
              } else {
                status = 401;
                result.status = status;
                result.error = `Authentication error`;
              }
              res.status(status).send(result);
            }).catch(err => {
              status = 500;
              result.status = status;
              result.error = err;
              res.status(status).send(result);
            });
          } else {
            status = 404;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
          }
        });
      } else {
        status = 500;
        result.status = status;
        result.error = err;
        res.status(status).send(result);
      }
    });
  },

  /**
   * User logout method
   * Used to log a user out.
   */
  logout: (req, res) => {

  }
}