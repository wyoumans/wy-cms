'use strict';

var confrodo = require('confrodo'),
    common   = __dirname + '/common.json',
    env      = __dirname + '/' + confrodo.env + '.json',
    config   = confrodo(common, env, 'ENV', 'ARGV');

module.exports = config;
