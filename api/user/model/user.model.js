/**
 * Module dependencies
 */
const mongoose = require('mongoose');
const path = require('path');
// eslint-disable-next-line import/no-dynamic-require
const config = require(path.resolve('./config/config'));
const { Schema } = mongoose;
const crypto = require('crypto');
const validator = require('validator');
const generatePassword = require('generate-password');
const owasp = require('owasp-password-strength-test');
const chalk = require('chalk');

owasp.config({
  allowPassphrases: true,
  maxLength: 128,
  minLength: 10,
  minPhraseLength: 20,
  minOptionalTestsToPass: 4,
});


/**
 * A Validation function for local strategy properties
 */
const validateLocalStrategyProperty = property => ((this.provider !== 'local' && !this.updated) || property.length);

/**
 * A Validation function for local strategy email
 */
const validateLocalStrategyEmail = email => ((this.provider !== 'local' && !this.updated) || validator.isEmail(email, { require_tld: false }));

/**
 * A Validation function for username
 * - at least 3 characters
 * - only a-z0-9_-.
 * - contain at least one alphanumeric character
 * - not in list of illegal usernames
 * - no consecutive dots: "." ok, ".." nope
 * - not begin or end with "."
 */

const validateUsername = (username) => {
  const usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
  return (
    this.provider !== 'local'
    || (username && usernameRegex.test(username) && config.illegalUsernames.indexOf(username) < 0)
  );
};

/**
 * User Schema
 */
const UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your first name'],
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your last name'],
  },
  displayName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    index: {
      unique: true,
      sparse: true, // For this to work on a previously indexed field, the index must be dropped
      // & the application restarted.
    },
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address'],
  },
  username: {
    type: String,
    unique: 'Username already exists',
    required: 'Please fill in a username',
    validate: [validateUsername, 'Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.'],
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    default: '',
  },
  salt: {
    type: String,
  },
  profileImageURL: {
    type: String,
    default: '/public/img/profile/default.png',
  },
  provider: {
    type: String,
    required: 'Provider is required',
  },
  providerData: {},
  additionalProvidersData: {},
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin'],
    }],
    default: ['user'],
    required: 'Please provide at least one role',
  },
  updated: {
    type: Date,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  /* For reset password */
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', (next) => {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  this.displayName = this.displayName || `${this.firstName} ${this.lastName}`;

  next();
});

/**
 * Hook a pre validate method to test the local password
 */
UserSchema.pre('validate', (next) => {
  if (this.provider === 'local' && this.password && this.isModified('password')) {
    const result = owasp.test(this.password);
    if (result.errors.length) {
      const error = result.errors.join(' ');
      this.invalidate('password', error);
    }
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = (password) => {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, Buffer.from(this.salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
  }
  return password;
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = (password) => {
  console.log(this);
  return this.password === UserSchema.methods.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = (username, suffix, callback) => {
  const possibleUsername = username.toLowerCase() + (suffix || '');

  this.findOne({
    username: possibleUsername,
  }, (err, user) => {
    if (!err) {
      if (!user) {
        return callback(possibleUsername);
      }
      return this.findUniqueUsername(username, (suffix || 0) + 1, callback);
    }
    return callback(null);
  });
};

/**
 * Generates a random passphrase that passes the owasp test
 * Returns a promise that resolves with the generated passphrase
 * or rejects with an error if something goes wrong.
 * NOTE: Passphrases are only tested against the required owasp strength tests
 * and not the optional tests.
 */
UserSchema.statics.generateRandomPassphrase = function () {
  return new Promise(((resolve, reject) => {
    let password = '';
    const repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

    // iterate until the we have a valid passphrase
    // NOTE: Should rarely iterate more than once,
    // but we need this to ensure no repeating characters are present
    while (password.length < 20 || repeatingCharacters.test(password)) {
      // build the random password
      password = generatePassword.generate({
        length: Math.floor(Math.random() * (20)) + 20, // randomize between 20 and 40 characters
        numbers: true,
        symbols: false,
        uppercase: true,
        excludeSimilarCharacters: true,
      });

      // check if we need to remove any repeating characters
      password = password.replace(repeatingCharacters, '');
    }

    // Send the rejection back if the passphrase fails to pass the strength test
    if (owasp.test(password).errors.length) {
      reject(new Error('An unexpected problem occurred while generating the random passphrase'));
    } else {
      // resolve with the validated passphrase
      resolve(password);
    }
  }));
};

/**
 * Seeds the User collection with document (User)
 * and provided options.
 */

function seed(doc, options) {
  const User = mongoose.model('User');

  function skipDocument() {
    return new Promise(((resolve, reject) => {
      User
        .findOne({
          username: doc.username,
        })
        // eslint-disable-next-line consistent-return
        .exec((err, existing) => {
          if (err) {
            return reject(err);
          }

          if (!existing) {
            return resolve(false);
          }

          if (existing && !options.overwrite) {
            return resolve(true);
          }

          // Remove User (overwrite)

          existing.remove((error) => {
            if (error) {
              return reject(error);
            }

            return resolve(false);
          });
        });
    }));
  }

  function add(skip) {
    // eslint-disable-next-line consistent-return
    return new Promise(((resolve, reject) => {
      if (skip) {
        return resolve({
          message: chalk.yellow(`Database Seeding: User\t\t${doc.username} skipped`),
        });
      }

      User.generateRandomPassphrase()
        .then((passphrase) => {
          const user = new User(doc);

          user.provider = 'local';
          user.displayName = `${user.firstName} ${user.lastName}`;
          user.password = passphrase;

          user.save((err) => {
            if (err) {
              return reject(err);
            }

            return resolve({
              message: `Database Seeding: User\t\t${user.username} added with password set to ${passphrase}`,
            });
          });
        })
        .catch(err => reject(err));
    }));
  }

  return new Promise(((resolve, reject) => {
    skipDocument()
      .then(add)
      .then(response => resolve(response))
      .catch(err => reject(err));
  }));
}

UserSchema.statics.seed = seed;

mongoose.model('User', UserSchema);
