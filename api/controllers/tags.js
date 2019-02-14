const logger = require('../lib/logger').getLogger();
const Events = require('../models/events');
const Tag = require('../models/tags');
const { formatApiResponse } = require('../lib/formatters');
const { NOT_ADDED } = require('../constants/tags');

const TagController = {
  /**
   * Create Tag Method
   * Creates a new tag
   * @returns {Object} The saved tag data.
   */
  create: (req, res) => {
    const {
      body: { name, drinkId },
      decoded: { userId },
    } = req;

    const tag = new Tag({ name, drinkId, userId });

    let result;

    // Validate the date being sent against the defined model
    tag.validate((err) => {
      if (err) {
        result = formatApiResponse(500, err, {});
        res.status(result.status).send(result);
      }
    });

    // Grab the latest event object
    TagController.getEvent(userId)
      .then((foundEvent) => {
        // Check if we have a drinks array
        if (foundEvent) {
          const drinksArray = JSON.parse(foundEvent.state).Drinks || [];

          // If they dont have any drink, dont let them add an ingredient
          if (drinksArray.length < 0) {
            result = formatApiResponse(500, 'You do not have any drinks', {});
            res.status(result.status).send(result);
          }

          const newState = {
            Drinks: drinksArray.map((drink) => {
              // Iterate through to find the right drink
              if (drink._id === drinkId) {
                const tags = drink.Tags || [];
                return {
                  ...drink,
                  Tags: [tag, ...tags],
                };
              }
              return drink;
            }),
          };

          // Create and Save the new event.
          const newEvent = new Events({
            userId,
            description: `Added new tag: ${name}`,
            state: JSON.stringify(newState),
          });
          newEvent.save()
            .then((savedEvent) => {
              if (savedEvent) {
                result = formatApiResponse(201, null, savedEvent);
                logger.trace(`New tag event was successfully added: ${newEvent}`);
              } else {
                result = formatApiResponse(500, NOT_ADDED, {});
                logger.trace(`New tag event was not added: ${newEvent}`);
              }
              res.status(result.status).send(result);
            });
        } else {
          logger.error('No events for this user. This is bad');
        }
      });
  },

  /**
   * Update Tag Method
   * Updates a tag
   * @param {String} id The id of the tag you want to update
   * @returns {Object} The updated tag
   */
  update: (req, res) => {
    const {
      body: { id, name, drinkId },
      decoded: { userId },
    } = req;

    const newTag = new Tag({ name, drinkId, userId });

    let result;

    // Validate the data being sent against the defined model
    newTag.validate((err) => {
      if (err) {
        result = formatApiResponse(500, err, {});
        res.status(result.status).send(result);
      }
    });

    // Grab the latest event object
    TagController.getEvent(userId)
      .then((foundEvent) => {
        // Check if we have a drinks array
        if (foundEvent) {
          const drinksArray = JSON.parse(foundEvent.state).Drinks || [];

          // If they dont have any drink, dont let them add an ingredient
          if (drinksArray.length < 0) {
            result = formatApiResponse(500, 'You do not have any drinks to add an ingredient to.', {});
            res.status(result.status).send(result);
          }

          // Add the new ingredient, filter out the old.
          const newState = {
            Drinks: drinksArray.map((drink) => {
              if (drink.Ingredients && drink._id === drinkId) {
                return {
                  ...drink,
                  Tags: [
                    newTag,
                    ...drink.Tags.filter(tag => tag._id !== id),
                  ],
                };
              }
              return drink;
            }),
          };

          // Create and Save the new event.
          const newEvent = new Events({
            userId,
            description: `Added new tag: ${name}`,
            state: JSON.stringify(newState),
          });
          newEvent.save()
            .then((savedEvent) => {
              if (savedEvent) {
                result = formatApiResponse(201, null, savedEvent);
                logger.trace(`Update tag event was successfully added: ${newEvent}`);
              } else {
                result = formatApiResponse(500, NOT_ADDED, {});
                logger.trace(`Update tag event was not added: ${newEvent}`);
              }
              res.status(result.status).send(result);
            });
        } else {
          logger.error('No events for this user. This is bad');
        }
      });
  },

  /**
   * Delete Tag Method
   * Deletes a tag from the drink
   * @param {String} id THe id of the tag to be deleted
   * @retuns {Object} The name and ID of the deleted tag
   */
  delete: (req, res) => {
    const {
      body: { id },
      decoded: { userId },
    } = req;

    let result;

    TagController.getEvent(userId)
      .then((foundEvent) => {
        if (foundEvent) {
          const drinksArray = JSON.parse(foundEvent.state).Drinks || [];
          const newState = {
            Drinks: drinksArray.map((drink) => {
              if (drink.Tags) {
                return {
                  ...drink,
                  Tags: drink.Tags.filter(tag => tag._id !== id),
                };
              }
              return drink;
            }),
          };

          // Create and Save the new event.
          const newEvent = new Events({
            userId,
            description: `Removed tag: ${id}`,
            state: JSON.stringify(newState),
          });
          newEvent.save()
            .then((savedEvent) => {
              if (savedEvent) {
                result = formatApiResponse(201, null, savedEvent);
                logger.trace(`Remove tag event was successfully added: ${newEvent}`);
              } else {
                result = formatApiResponse(500, NOT_ADDED, {});
                logger.trace(`Remove tag event was not added: ${newEvent}`);
              }
              res.status(result.status).send(result);
            });
        } else {
          logger.error('No events for this user. This is bad');
        }
      });
  },

  getEvent: userId => Events.findOne({ userId }, {}, { sort: { createdAt: -1 } }),
};

module.exports = TagController;
