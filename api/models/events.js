const mongoose = require('mongoose');

// schema maps to a collection
const { Schema } = mongoose;

const eventSchema = new Schema({
  userId: {
    type: 'String',
    required: true,
    trim: true,
  },
  description: {
    type: 'String',
    trim: true,
  },
  state: {
    type: 'String',
    trim: true,
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('Event', eventSchema);
