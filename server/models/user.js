const mongoose = require('mongoose');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  profile: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
  },
  fccPoints: {
    type: Number,
    required: true,
    minlength: 10
  },
  profileImage: {
    type: String,
    maxlength: 75
  },
  lastProject: {
    name: {
      type: String,
      maxLength: 50
    },
    date: {
      type: String,
      maxLength: 30
    }
  },
  lastAlgorithm: {
    name: {
      type: String,
      maxLength: 50
    },
    date: {
      type: String,
      maxLength: 30
    }
  },
  lastChallenge: {
    name: {
      type: String,
      maxLength: 50
    },
    date: {
      type: String,
      maxLength: 30
    }
  },
  test: String,  
  createdAt: {
    type: Date,
    expires: '24h',
    default: Date.now
  }
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['profile', 'fccPoints', 'profileImage', 'lastProject', 'lastAlgorithm', 'lastChallenge', 'createdAt']);
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};
