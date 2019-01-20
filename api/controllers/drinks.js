const mongoose = require('mongoose');
const Drink = require('../models/drinks');
const { formatApiResponse } = require('../lib/formatters');
const connUri = process.env.MONGO_LOCAL_CONN_URL;
const { 
  NOT_ADDED,
  NOT_ADDED_DEV,
  NOT_FOUND_ERROR, 
  NOT_FOUND_ERROR_DEV,
  ID_NOT_PROVIDED,
  FAILED_UPDATE_ERROR,
  FAILED_DELETE_ERROR
} = require('../constants/drinks');

module.exports = {
  /**
   * Create Drink Method
   * Creates a new drink
   * @returns {Object} The saved drink data.
   */
  create: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser : true }, (err) => {
      let result = {};
      let status = 200;
      if (!err) {
        const { bbId, userId } = req.decoded;
        const { name, slug, description } = req.body;
        const drink = new Drink({ name, slug, userId, bbId, description });

        drink.save()
          .then(drink => {
            // If we get nothing back. it wasnt saved
            if (!drink) {
              result = formatApiResponse(500, {
                user: NOT_ADDED,
                dev: NOT_ADDED_DEV
              }, {});
            } else {
              result = formatApiResponse(201, null, drink)
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
   * Read Drink Method
   * @param {String} slug The slug to lookup the drink.
   * returns {object} API call results
   */
  read: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
      let result = {};
      let status = 200;
      if (!err) {
        console.log(req);
        const id = req.query.id;
        const userId = req.decoded.id;
        if ( id ) {
          Drink.findOne({ _id: id, userId }) 
            .then(drink => {
              // If we get nothing back. it wasnt saved
              if (!drink) {
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
      } else {
        result = formatApiResponse(500, err, null);
        res.status(result.status).send(result);
      }
    });
  },

  /**
   * ReadAll Drinks Method
   * Grabs all of a users drink recipes
   * @returns {Object} All the users saved drinks. 
   */
  readAll: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
      let result = {};
      let status = 200;
      if (!err) {
        const userId = req.decoded.id;
        Drink.find({ userId })
          .then(drinks => {
            // If we get nothing back. they have no drinks
            if (!drinks) {
              result = formatApiResponse(status, null, {});
            } else {
              result = formatApiResponse(status, null, drinks)
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
        result = formatApiResponse(500, err, null);
        res.status(result.status).send(result);
      }
    });
  },

  /**
   * Update Drink Method
   * Updates a users drink
   * @param {String} slug The slug of the drink you want to update
   * @returns {Object} The updated drink
   */
  update: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
      let result = {};
      let status = 200;
      if (!err) {
        const id = req.body.id;
        const { userId } = req.decoded;
        req.body.userId = userId;
        Drink.findOneAndUpdate({ _id: id, userId }, req.body, { new: true })
          .then(drink => {
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
   * Delete Drink Method
   * Deletes a drink from the users book o drinks
   * @param {String} id THe id of the drink to be deleted
   * @retuns {Object} The name and ID of the deleted drink
   */
  delete: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
      let result = {};
      let status = 200;
      if (!err) {
        const id = req.body.id;
        const { userId } = req.decoded;
        Drink.findOneAndDelete({ _id: id, userId }, { select: ["name", "id"] })
          .then(drink => {
            result = formatApiResponse(status, null, drink);
            res.status(status).send(result);
          })
          .catch(err => {
            result = formatApiResponse(500, {
              user: FAILED_DELETE_ERROR,
              dev: err
            }, null);
            res.status(result.status).send(result);
          });
      } else {
        result = formatApiResponse(500, err, null);
        res.status(result.status).send(result);
      }
    });
  }
}