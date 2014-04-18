'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

module.exports = {
  express: {
    customMiddleware: function(app) {
      app.use(passport.initialize());
      app.use(passport.session());

      // Give the views access to the logged in status
      app.use(function(req, res, next) {
        if (req.isAuthenticated()) {
          res.locals.isLoggedIn = true;
          res.locals.user = req.user;
        }

        return next();
      });
    }
  }
};
