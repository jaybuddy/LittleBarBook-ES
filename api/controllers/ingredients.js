const Ingredient = require('../models/ingredients');
const { formatApiResponse } = require('../lib/formatters');
const {
  NOT_ADDED,
  NOT_ADDED_DEV,
  NOT_FOUND_ERROR,
  NOT_FOUND_ERROR_DEV,
  ID_NOT_PROVIDED,
  FAILED_UPDATE_ERROR,
  FAILED_DELETE_ERROR,
} = require('../constants/ingredients');

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
    let result = {};
    ingredient.save()
      .then((savedIngredient) => {
        if (!savedIngredient) {
          result = formatApiResponse(500, {
            user: NOT_ADDED,
            dev: NOT_ADDED_DEV,
          }, {});
        } else {
          result = formatApiResponse(201, null, savedIngredient);
        }
        res.status(result.status).send(result);
      })
      .catch(error => IngredientController.onPassthruError(res, error));
  },

  /**
   * Read Ingredient Method
   * @param {String} Id The id to lookup the ingredient.
   * returns {object} API call results
   */
  read: (req, res) => {
    const {
      query: { id },
      decoded: { userId },
    } = req;
    let result = {};

    if (id) {
      Ingredient.findOne({ _id: id, userId })
        .then((ingredient) => {
          // If we get nothing back. it wasnt saved
          if (!ingredient) {
            result = formatApiResponse(500, {
              user: NOT_FOUND_ERROR,
              dev: NOT_FOUND_ERROR_DEV,
            }, {});
          } else {
            result = formatApiResponse(200, null, ingredient);
          }
          res.status(result.status).send(result);
        })
        .catch(error => IngredientController.onPassthruError(res, error));
    } else {
      result = formatApiResponse(500, {
        user: NOT_FOUND_ERROR,
        dev: ID_NOT_PROVIDED,
      }, null);
      res.status(result.status).send(result);
    }
  },

  /**
   * ReadAll Ingredients Method
   * Grabs all of a ingredients for a given drink id
   * @returns {Object} All the drinks saved ingredients.
   */
  readAll: (req, res) => {
    const {
      query: { id },
      decoded: { userId },
    } = req;
    let result = {};

    Ingredient.find({ drinkId: id, userId })
      .then((ingredients) => {
        // If we get nothing back. the drink has no ingredients
        if (!ingredients) {
          result = formatApiResponse(200, null, {});
        } else {
          result = formatApiResponse(200, null, ingredients);
        }
        res.status(result.status).send(result);
      })
      .catch(error => IngredientController.onPassthruError(res, error));
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

    Ingredient.findOneAndDelete({ _id: id, userId }, { select: ['name', 'id'] })
      .then((ingredient) => {
        result = formatApiResponse(200, null, ingredient);
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
   * Delete all method
   * Removes all the ingredients for a given drink
   * @param {String} drinkId The id of the parent drink
   */
  deleteAll: (req, res) => {
    const {
      body: { drinkId },
      decoded: { userId },
    } = req;
    let result = {};

    Ingredient.deleteMany({ drinkId, userId })
      .then((ingredient) => {
        result = formatApiResponse(200, null, ingredient);
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
};

module.exports = IngredientController;
