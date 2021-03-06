const Events = require('../models/events');
const { formatApiResponse } = require('../lib/formatters');
const {
  NOT_ADDED,
  NOT_ADDED_DEV,
  NOT_FOUND_ERROR,
  NOT_FOUND_ERROR_DEV,
  ID_NOT_PROVIDED,
} = require('../constants/events');

const EventController = {
  /**
   * Create Event Method
   * Creates a new event
   * @returns {Object} The saved event data.
   */
  create: (req, res) => {
    const {
      decoded: { userId },
      body: { description, state },
    } = req;
    const event = new Events({
      userId, description, state,
    });
    let result = {};

    event.save()
      .then((savedEvent) => {
        if (!savedEvent) {
          result = formatApiResponse(500, {
            user: NOT_ADDED,
            dev: NOT_ADDED_DEV,
          }, {});
        } else {
          result = formatApiResponse(201, null, savedEvent);
        }
        res.status(result.status).send(result);
      })
      .catch(error => EventController.onPassthruError(res, error));
  },

  /**
   * Read Event Method
   * @param {String} slug The slug to lookup the drink.
   * returns {object} API call results
   */
  read: (req, res) => {
    const {
      decoded: { userId },
    } = req;
    let result = {};

    if (userId) {
      Events.findOne({ userId }, {}, { sort: { createdAt: -1 } })
        .then((event) => {
          // If we get nothing back. it wasnt saved
          if (!event) {
            result = formatApiResponse(500, {
              user: NOT_FOUND_ERROR,
              dev: NOT_FOUND_ERROR_DEV,
            }, {});
          } else {
            result = formatApiResponse(200, null, event);
          }
          res.status(result.status).send(result);
        })
        .catch(error => EventController.onPassthruError(res, error));
    } else {
      result = formatApiResponse(500, {
        user: NOT_FOUND_ERROR,
        dev: ID_NOT_PROVIDED,
      }, null);
      res.status(result.status).send(result);
    }
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

module.exports = EventController;
