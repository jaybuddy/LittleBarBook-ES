const mongoose = require('mongoose');

// schema maps to a collection
const { Schema } = mongoose;

const tokenSchema = new Schema({
  token: {
    type: 'String',
    required: true,
    trim: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 2 * 2 });
// tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

module.exports = mongoose.model('Token', tokenSchema);
