const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function(el) {
        return this.password === el;
      },
      message: 'Passwords do not match'
    }
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'publisher'],
      message: "Role must be either 'user' or 'publisher'"
    },
    default: 'user'
  },
  passwordChangedAt: {
    type: Date,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate hashed password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

// Update changed password time
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now();

  next();
});

// Check if password is correct
userSchema.methods.isPasswordCorrect = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check for changed user password
userSchema.methods.wasPasswordChanged = function(jwtIssuedAt) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changedTimestamp > jwtIssuedAt;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
