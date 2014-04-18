'use strict';

/**
 * Logger configuration
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * http://sailsjs.org/#documentation
 */


var winston       = require('winston'),
    fs            = require('fs'),
    logDir        = __dirname + '/../logs',
    debugFile     = __dirname + '/../logs/debug.log',
    exceptionFile = __dirname + '/../logs/exceptions.log',
    logsExist     = fs.existsSync(logDir);

if (!logsExist) {
  fs.mkdirSync(logDir);
  fs.writeFileSync(debugFile, "File Created at: " + new Date().toString() + "\n\n");
  fs.writeFileSync(exceptionFile, "File Created at: " + new Date().toString() + "\n\n");
}

module.exports = {
  log: {
    level: 'info',

    transports: [
      new(winston.transports.Console)({
        colorize: true
      }),
      new(winston.transports.File)({
        filename: debugFile,
        timestamp: true,
        json: false
      })
    ],

    exceptionHandlers: [
      new(winston.transports.Console)({
        colorize: true
      }),
      new(winston.transports.File)({
        filename: exceptionFile,
        timestamp: true,
        json: false
      })
    ],

    exitOnError: false
  }
};
