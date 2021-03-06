const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const environment = process.env.NODE_ENV;
const stage = require('../../config')[environment];

// schema maps to a collection
const { Schema } = mongoose;

const validateEmail = (email) => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new Schema({
  displayName: {
    type: 'String',
    trim: true,
    unique: true,
  },
  email: {
    type: 'String',
    trim: true,
    unique: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
  },
  password: {
    type: 'String',
    required: true,
  },
  role: {
    type: 'String',
    required: true,
    default: 'user',
  },
},
{
  timestamps: true,
});

// encrypt password before save
userSchema.pre('save', function preSave(next) {
  const user = this;
  if (!user.isModified || !user.isNew) { // don't rehash if it's an old user
    next();
  } else {
    // Hash password
    bcrypt.hash(user.password, stage.saltingRounds, (err, hash) => {
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
