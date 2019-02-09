const mongoose = require('mongoose');

// schema maps to a collection
const { Schema } = mongoose;

const tagSchema = new Schema({
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
},
{
  timestamps: true,
});

module.exports = mongoose.model('Tag', tagSchema);
