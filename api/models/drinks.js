const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

// schema maps to a collection
const { Schema } = mongoose;

const drinkSchema = new Schema({
  name: {
    type: 'String',
    required: true,
    trim: true,
    unique: true,
  },
  slug: {
    type: 'String',
    slug: ['bbId', 'name'],
    unique: true,
  },
  userId: {
    type: 'String',
    required: true,
    trim: true,
  },
  bbId: {
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
