'use strict';

/**
 * AuthController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var passport = require('passport'),
    logger   = require('../helpers/logger');

module.exports = {

  login: function(req, res) {
    if (Object.keys(req.body).length) {
      passport.authenticate('local', function(err, user, info) {
        if ((err) || (!user)) {
          res.locals.error = 'Invalid username or password';
          return res.view();
        }
        req.logIn(user, function(err) {
          if (err) {
            return res.send(err);
          } else if (req.xhr) {
            return res.json(user);
          } else {
            return res.redirect('/');
          }
        });
      })(req, res);
    } else {
      res.view();
    }
  },

  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  },

  getCurrentUser: function(req, res) {
    if (req.isAuthenticated()) {
      return res.json({
        ok: true,
        user: req.user
      });
    } else {
      return res.json('Forbidden', 403);
    }
  }
};
