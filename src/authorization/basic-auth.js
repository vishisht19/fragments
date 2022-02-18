// src/authorization/basic-auth.js

// Configure HTTP Basic Auth strategy for Passport, see:
// https://github.com/http-auth/http-auth-passport

const auth = require('http-auth');
// eslint-disable-next-line no-unused-vars
const passport = require('passport');
const authPassport = require('http-auth-passport');

// We'll use our authorize middle module
const authorize = require('./authorize-middleware');

// We expect HTPASSWD_FILE to be defined.
// eslint-disable-next-line no-undef
if (!process.env.HTPASSWD_FILE) {
  throw new Error('missing expected env var: HTPASSWD_FILE');
}

module.exports.strategy = () =>
  // For our Passport authentication strategy, we'll look for a
  // username/password pair in the Authorization header.
  authPassport(
    auth.basic({
      // eslint-disable-next-line no-undef
      file: process.env.HTPASSWD_FILE,
    })
  );

// Previously we defined `authenticate()` like this:
// module.exports.authenticate = () => passport.authenticate('http', { session: false });
//
// Now we'll delegate the authorization to our authorize middleware
module.exports.authenticate = () => authorize('http');
