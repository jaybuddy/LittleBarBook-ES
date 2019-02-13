const logger = require('../lib/logger').getLogger();
const Events = require('../models/events');
const Ingredient = require('../models/ingredients');
const { formatApiResponse } = require('../lib/formatters');
const { NOT_ADDED } = require('../constants/ingredients');

const IngredientController = {
  /**
   * Create Ingredient Method
   * Creates a new ingredient
   * @returns {Object} The saved ingredient data.
   */
  create: (req, res) => {
    const {
      decoded: { userId },
      body: { name, drinkId, notes },
    } = req;

    const ingredient = new Ingredient({
      name, userId, drinkId, notes,
    });

    let result;

    // Validate the date being sent against the defined model
    ingredient.validate((err) => {
      if (err) {
        result = formatApiResponse(500, err, {});
        res.status(result.status).send(result);
      }
    });

    // Grab the latest event object
    IngredientController.getEvent(userId)
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
                const ingredients = drink.Ingredients || [];
                return {
                  ...drink,
                  Ingredients: [ingredient, ...ingredients],
                };
              }
              return drink;
            }),
          };

          // Create and Save the new event.
          const newEvent = new Events({
            userId,
            description: `Added new ingredient: ${name}`,
            state: JSON.stringify(newState),
          });
          newEvent.save()
            .then((savedEvent) => {
              if (savedEvent) {
                result = formatApiResponse(201, null, savedEvent);
                logger.trace(`New ingredient event was successfully added: ${newEvent}`);
              } else {
                result = formatApiResponse(500, NOT_ADDED, {});
                logger.trace(`New ingredient event was not added: ${newEvent}`);
              }
              console.log(result);
              res.status(result.status).send(result);
            });
        } else {
          logger.error('No events for this user. This is bad');
        }
      });
  },

  /**
   * Update Ingredient Method
   * Updates an ingredient
   * @param {id} id The id of the ingredient to update
   * @returns {Object} The updated ingredient
   */
  update: (req, res) => {
    const {
      body: { id },
      decoded: { userId },
    } = req;
    let result = {};
    req.body.userId = userId;

    Ingredient.findOneAndUpdate({ _id: id, userId }, req.body, { new: true })
      .then((ingredient) => {
        result = formatApiResponse(201, null, ingredient);
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

    IngredientController.getEvent(userId)
      .then((foundEvent) => {
        if (foundEvent) {
          const drinksArray = JSON.parse(foundEvent.state).Drinks || [];
          const newState = {
            Drinks: drinksArray.map((drink) => {
              if (drink.Ingredients) {
                return {
                  ...drink,
                  Ingredients: drink.Ingredients.filter(ingredient => ingredient._id !== id),
                };
              }
              return drink;
            }),
          };

          // Create and Save the new event.
          const newEvent = new Events({
            userId,
            description: `Removed ingredient: ${id}`,
            state: JSON.stringify(newState),
          });
          newEvent.save()
            .then((savedEvent) => {
              if (savedEvent) {
                result = formatApiResponse(201, null, savedEvent);
                logger.trace(`Remove ingredient event was successfully added: ${newEvent}`);
              } else {
                result = formatApiResponse(500, NOT_ADDED, {});
                logger.trace(`Remove ingredient event was not added: ${newEvent}`);
              }
              res.status(result.status).send(result);
            });
        } else {
          logger.error('No events for this user. This is bad');
        }
      });

    // Ingredient.findOneAndDelete({ _id: id, userId }, { select: ['name', 'id'] })
    //   .then((ingredient) => {
    //     result = formatApiResponse(200, null, ingredient);
    //     res.status(result.status).send(result);
    //   })
    //   .catch((error) => {
    //     result = formatApiResponse(500, {
    //       user: FAILED_DELETE_ERROR,
    //       dev: error,
    //     }, null);
    //     res.status(result.status).send(result);
    //   });
  },

  getEvent: userId => Events.findOne({ userId }, {}, { sort: { createdAt: -1 } }),
};

module.exports = IngredientController;
