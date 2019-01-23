const mongoose = require('mongoose');

// schema maps to a collection
const { Schema } = mongoose.Schema;

const ingredientSchema = new Schema({
  name: {
    type: 'String',
    required: true,
    trim: true,
    unique: true,
  },
  userId: {
    type: 'String',
    required: true,
    trim: true,
  },
  drinkId: {
    type: 'String',
    required: true,
    trim: true,
  },
  notes: {
    type: 'String',
    trim: true,
  },
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
