'use strict';
/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  if (req.isAuthenticated()) {
    return next();
  } else if (req.xhr) {
    return res.json('Forbidden', 403);
  } else {
    return res.redirect('/login');
  }
};
