const mongoose = require('mongoose');
const Tag = require('../models/tags');
const { formatApiResponse } = require('../lib/formatters');
const connUri = require('../lib/database');
const {
  NOT_ADDED,
  NOT_ADDED_DEV,
  NOT_FOUND_ERROR,
  NOT_FOUND_ERROR_DEV,
  ID_NOT_PROVIDED,
  FAILED_UPDATE_ERROR,
  FAILED_DELETE_ERROR,
  FAILED_TO_CONNECT,
} = require('../constants/tags');

const TagController = {
  /**
   * Create Tag Method
   * Creates a new tag
   * @returns {Object} The saved tag data.
   */
  create: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true })
      .then(() => {
        const {
          body: { name, drinkId },
          decoded: { userId },
        } = req;
        const tag = new Tag({ name, drinkId, userId });
        let result = {};
        // Save the tag
        tag.save()
          .then((savedTag) => {
            if (!savedTag) {
              result = formatApiResponse(500, {
                user: NOT_ADDED,
                dev: NOT_ADDED_DEV,
              }, {});
            } else {
              result = formatApiResponse(201, null, savedTag);
            }
            res.status(result.status).send(result);
          })
          .catch(error => TagController.onPassthruError(res, error));
      })
      .catch(() => TagController.onNoConnection(res));
  },

  /**
   * Read Tag Method
   * @param {String} id The id to lookup the tag.
   * returns {object} API call results
   */
  read: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true })
      .then(() => {
        const {
          query: { id },
          decoded: { userId },
        } = req;
        let result = {};

        if (id) {
          Tag.findOne({ _id: id, userId })
            .then((tag) => {
              // If we get nothing back. it wasnt saved
              if (!tag) {
                result = formatApiResponse(500, {
                  user: NOT_FOUND_ERROR,
                  dev: NOT_FOUND_ERROR_DEV,
                }, {});
              } else {
                result = formatApiResponse(200, null, tag);
              }
              res.status(result.status).send(result);
            })
            .catch(error => TagController.onPassthruError(res, error));
        } else {
          result = formatApiResponse(500, {
            user: NOT_FOUND_ERROR,
            dev: ID_NOT_PROVIDED,
          }, null);
          res.status(result.status).send(result);
        }
      })
      .catch(() => TagController.onNoConnection(res));
  },

  /**
   * ReadAll Tags Method
   * Grabs all of a drinks tags
   * @returns {Object} All the tags for a drink.
   */
  readAll: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true })
      .then(() => {
        let result;
        const {
          query: { drinkId },
          decoded: { userId },
        } = req;
        console.log(req.query, req.decoded);
        Tag.find({ drinkId, userId })
          .then((tags) => {
            // If we get nothing back. they have no drinks
            if (!tags) {
              result = formatApiResponse(200, null, {});
            } else {
              result = formatApiResponse(200, null, tags);
            }
            res.status(result.status).send(result.data);
          })
          .catch(error => TagController.onPassthruError(res, error));
      })
      .catch(() => TagController.onNoConnection(res));
  },

  /**
   * Update Tag Method
   * Updates a tag
   * @param {String} id The id of the tag you want to update
   * @returns {Object} The updated tag
   */
  update: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true })
      .then(() => {
        const {
          body: { id },
          decoded: { userId },
        } = req;
        let result = {};
        req.body.userId = userId;

        Tag.findOneAndUpdate({ _id: id, userId }, req.body, { new: true })
          .then((tag) => {
            result = formatApiResponse(201, null, tag);
            res.status(result.status).send(result);
          })
          .catch((error) => {
            result = formatApiResponse(500, {
              user: FAILED_UPDATE_ERROR,
              dev: error,
            }, null);
            res.status(result.status).send(result);
          });
      })
      .catch(() => TagController.onNoConnection(res));
  },

  /**
   * Delete Tag Method
   * Deletes a tag from the drink
   * @param {String} id THe id of the tag to be deleted
   * @retuns {Object} The name and ID of the deleted tag
   */
  delete: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true })
      .then(() => {
        const {
          body: { id },
          decoded: { userId },
        } = req;
        let result = {};

        Tag.findOneAndDelete({ _id: id, userId }, { select: ['name', 'id'] })
          .then((tag) => {
            result = formatApiResponse(200, null, tag);
            res.status(result.status).send(result);
          })
          .catch((error) => {
            result = formatApiResponse(500, {
              user: FAILED_DELETE_ERROR,
              dev: error,
            }, null);
            res.status(result.status).send(result);
          });
      })
      .catch(() => TagController.onNoConnection(res));
  },

  /**
   * Delete all method
   * Removes all the tags for a given drink
   * @param {String} drinkId The id of the parent drink
   */
  deleteAll: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true })
      .then(() => {
        const {
          body: { drinkId },
          decoded: { userId },
        } = req;
        let result = {};

        Tag.deleteMany({ drinkId, userId })
          .then((tags) => {
            result = formatApiResponse(200, null, tags);
            res.status(result.status).send(result);
          })
          .catch((error) => {
            result = formatApiResponse(500, {
              user: FAILED_DELETE_ERROR,
              dev: error,
            }, null);
            res.status(result.status).send(result);
          });
      })
      .catch(() => TagController.onNoConnection(res));
  },

  /**
   * onNoConnection
   * Helper function that sends the no connection error
   * @param {Object} res The response object
   */
  onNoConnection: (res) => {
    const result = formatApiResponse(500, {
      user: FAILED_TO_CONNECT,
      dev: FAILED_TO_CONNECT,
    }, null);
    res.status(result.status).send(result);
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

module.exports = TagController;
