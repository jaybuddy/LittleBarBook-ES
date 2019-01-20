const environment = process.env.NODE_ENV; // development
const stage = require('../config')[environment];
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

const connUri = process.env.MONGO_LOCAL_CONN_URL;

module.exports = {
  create: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser : true }, (err) => {
      let result = {};
      let status = 200;
      if (!err) {
        const { name, password, email } = req.body;
        const user = new User({ name, password, email }); // document = instance of a model
        // TODO: We can hash the password here before we insert instead of in the model
        user.save((err, user) => {
          if (!err) {
            result.status = status;
            result.result = user;
          } else {
            status = 500;
            result.status = status;
            result.error = err;
          }
          res.status(status).send(result);
        });
      } else {
        status = 500;
        result.status = status;
        result.error = err;
        res.status(status).send(result);
      }
    });
  },

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

  read: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
      let result = {};
      let status = 200;
      if (!err) {
        const {id} = req.decoded;
        User.findOne({ _id: id }, (err, users) => {
          if (!err) {
            result.status = status;
            result.error = err;
            result.result = users;
          } else {
            status = 500;
            result.status = status;
            result.error = err;
          }
          res.status(status).send(result);
        });
        
      } else {
        status = 500;
        result.status = status;
        result.error = err;
        res.status(status).send(result);
      }
    });
  }
}