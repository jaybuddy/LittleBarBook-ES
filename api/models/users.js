const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { randomHash } = require('../lib/utils');

const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];

// schema maps to a collection
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: 'String',
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: 'String',
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: 'String',
    required: true,
    trim: true
  },
  bbId: {
    type: String,
    trim: true,
  },
  role: {
    type: 'String',
    required: true,
    default: 'user'
  },
});

// encrypt password before save
userSchema.pre('save', function(next) {
  const user = this;
  if(!user.isModified || !user.isNew) { // don't rehash if it's an old user
    next();
  } else {
    // Add the bbId
    user.bbId = randomHash(5);
    // Hash password
    bcrypt.hash(user.password, stage.saltingRounds, function(err, hash) {
      if (err) {
        console.log('Error hashing password for user', user.name);
        next(err);
      } else {
        user.password = hash;
        next();
      }
    });
  }
});

module.exports = mongoose.model('User', userSchema);