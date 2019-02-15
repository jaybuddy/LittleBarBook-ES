const logger = require('../lib/logger').getLogger();
const Drink = require('../models/drinks');
const Events = require('../models/events');
const { formatApiResponse } = require('../lib/formatters');
const { NOT_ADDED } = require('../constants/drinks');

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

    let result = {};

    // Validate the date being sent against the defined model
    drink.validate((err) => {
      if (err) {
        result = formatApiResponse(500, err, {});
        res.status(result.status).send(result);
      }
    });

    // Grab the latest event object
    DrinkController.getEvent(userId)
      .then((foundEvent) => {
        // Check if we have a drinks array
        if (foundEvent) {
          const drinksArray = JSON.parse(foundEvent.state).Drinks || [];
          const newState = {
            Drinks: [drink, ...drinksArray],
          };

          // Create and Save the new event.
          const newEvent = new Events({
            userId,
            description: `Added new drink: ${name}`,
            state: JSON.stringify(newState),
          });
          newEvent.save()
            .then(savedEvent => DrinkController.postSave(newEvent, savedEvent, res, 'New'));
        } else {
          logger.error('No events for this user. This is bad');
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
    const {
      body: { id, name, description },
      decoded: { userId },
    } = req;

    const drink = new Drink({
      name, userId, description,
    });

    let result = {};

    // Validate the date being sent against the defined model
    drink.validate((err) => {
      if (err) {
        result = formatApiResponse(500, err, {});
        res.status(result.status).send(result);
      }
    });

    DrinkController.getEvent(userId)
      .then((foundEvent) => {
        if (foundEvent) {
          const drinksArray = JSON.parse(foundEvent.state).Drinks || [];
          // Add the new drink, filter out the old.
          const newState = {
            Drinks: [drink, ...drinksArray]
              .filter(remove => remove._id !== id),
          };

          // Create and Save the new event.
          const newEvent = new Events({
            userId,
            description: `Removed drink: ${id}`,
            state: JSON.stringify(newState),
          });
          newEvent.save()
            .then(savedEvent => DrinkController.postSave(newEvent, savedEvent, res, 'Update'));
        } else {
          logger.error('No events for this user. This is bad');
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
    const {
      body: { id },
      decoded: { userId },
    } = req;

    DrinkController.getEvent(userId)
      .then((foundEvent) => {
        if (foundEvent) {
          const drinksArray = JSON.parse(foundEvent.state).Drinks || [];
          const newState = {
            Drinks: drinksArray.filter(drink => drink._id !== id),
          };

          // Create and Save the new event.
          const newEvent = new Events({
            userId,
            description: `Removed drink: ${id}`,
            state: JSON.stringify(newState),
          });
          newEvent.save()
            .then(savedEvent => DrinkController.postSave(newEvent, savedEvent, res, 'Remove'));
        } else {
          logger.error('No events for this user. This is bad');
        }
      });
  },

  /**
   * getEvent
   * Grabs the latest event for a user
   * @param {String} userId The user id
   * @return {Object} The users latest event
   */
  getEvent: userId => Events.findOne({ userId }, {}, { sort: { createdAt: -1 } }),

  /**
   * postSave
   * Handles post-save actions common to all methods
   * @param {Object} newEvent The new event saved
   * @param {Object} savedEvent The entire event.
   * @param {Object} res The response object
   * @param {String} verb A describing work.
   */
  postSave: (newEvent, savedEvent, res, verb) => {
    let result;
    if (savedEvent) {
      result = formatApiResponse(201, null, savedEvent);
      logger.trace(`${verb} tag event was successfully added: ${newEvent}`);
    } else {
      result = formatApiResponse(500, NOT_ADDED, {});
      logger.trace(`${verb} tag event was not added: ${newEvent}`);
    }
    res.status(result.status).send(result);
  },
};

module.exports = DrinkController;
