const mongoose = require('mongoose');
const Drink = require('../models/drinks');
const Events = require('../models/events');
const { formatApiResponse } = require('../lib/formatters');
const {
  NOT_ADDED,
  NOT_ADDED_DEV,
  NOT_FOUND_ERROR,
  NOT_FOUND_ERROR_DEV,
  ID_NOT_PROVIDED,
  FAILED_UPDATE_ERROR,
  FAILED_DELETE_ERROR,
  FAILED_TO_CONNECT,
} = require('../constants/drinks');

const DrinkController = {
  /**
   * Create Drink Method
   * Creates a new drink
   * @returns {Object} The saved drink data.
   */
  create: (req, res) => {
    const {
      decoded: { userId },
      body: { name, description },
    } = req;
    const drink = new Drink({
      name, userId, description,
    });
    const result = {};

    // pull the latest event object
    const event = DrinkController.getEvent(userId)
      .then((foundEvent) => {
        console.log(foundEvent);
      });

    // modify it

    // create new event
    // Save the drink
    // drink.save()
    //   .then((savedDrink) => {
    //     if (!savedDrink) {
    //       result = formatApiResponse(500, {
    //         user: NOT_ADDED,
    //         dev: NOT_ADDED_DEV,
    //       }, {});
    //     } else {
    //       result = formatApiResponse(201, null, savedDrink);
    //     }
    //     res.status(result.status).send(result);
    //   })
    //   .catch(error => DrinkController.onPassthruError(res, error));
  },

  /**
   * Read Drink Method
   * @param {String} slug The slug to lookup the drink.
   * returns {object} API call results
   */
  read: (req, res) => {
    const {
      query: { id },
      decoded: { userId },
    } = req;
    let result = {};

    if (id) {
      Drink.findOne({ _id: id, userId })
        .then((drink) => {
          // If we get nothing back. it wasnt saved
          if (!drink) {
            result = formatApiResponse(500, {
              user: NOT_FOUND_ERROR,
              dev: NOT_FOUND_ERROR_DEV,
            }, {});
          } else {
            result = formatApiResponse(200, null, drink);
          }
          res.status(result.status).send(result);
        })
        .catch(error => DrinkController.onPassthruError(res, error));
    } else {
      result = formatApiResponse(500, {
        user: NOT_FOUND_ERROR,
        dev: ID_NOT_PROVIDED,
      }, null);
      res.status(result.status).send(result);
    }
  },

  /**
   * ReadAll Drinks Method
   * Grabs all of a users drink recipes
   * @returns {Object} All the users saved drinks.
   */
  readAll: (req, res) => {
    let result;
    const { userId } = req.decoded;
    Drink.find({ userId })
      .then((drinks) => {
        // If we get nothing back. they have no drinks
        if (!drinks) {
          result = formatApiResponse(200, null, {});
        } else {
          result = formatApiResponse(200, null, drinks);
        }
        res.status(result.status).send(result.data);
      })
      .catch(error => DrinkController.onPassthruError(res, error));
  },

  /**
   * Update Drink Method
   * Updates a users drink
   * @param {String} slug The slug of the drink you want to update
   * @returns {Object} The updated drink
   */
  update: (req, res) => {
    const {
      body: { id },
      decoded: { userId },
    } = req;
    let result = {};
    req.body.userId = userId;

    Drink.findOneAndUpdate({ _id: id, userId }, req.body, { new: true })
      .then((drink) => {
        result = formatApiResponse(201, null, drink);
        res.status(result.status).send(result);
      })
      .catch((error) => {
        result = formatApiResponse(500, {
          user: FAILED_UPDATE_ERROR,
          dev: error,
        }, null);
        res.status(result.status).send(result);
      });
  },

  /**
   * Delete Drink Method
   * Deletes a drink from the users book o drinks
   * @param {String} id THe id of the drink to be deleted
   * @retuns {Object} The name and ID of the deleted drink
   */
  delete: (req, res) => {
    const {
      body: { id },
      decoded: { userId },
    } = req;
    let result = {};

    Drink.findOneAndDelete({ _id: id, userId }, { select: ['name', 'id'] })
      .then((drink) => {
        result = formatApiResponse(200, null, drink);
        res.status(result.status).send(result);
      })
      .catch((error) => {
        result = formatApiResponse(500, {
          user: FAILED_DELETE_ERROR,
          dev: error,
        }, null);
        res.status(result.status).send(result);
      });
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

  getEvent: userId => Events.findOne({ userId }, 'state', { createdAt: -1 }),
};

module.exports = DrinkController;
