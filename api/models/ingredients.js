const mongoose = require('mongoose');

// schema maps to a collection
const { Schema } = mongoose;

const ingredientSchema = new Schema({
  name: {
    type: 'String',
    required: true,
    trim: true,
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
},
{
  timestamps: true,
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
