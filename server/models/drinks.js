const mongoose = require('mongoose');

// schema maps to a collection
const { Schema } = mongoose;

const drinkSchema = new Schema({
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
  description: {
    type: 'String',
    trim: true,
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('Drink', drinkSchema);
