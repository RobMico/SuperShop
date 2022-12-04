var winston = require('winston');
const { dirname } = require('path');
const appRoot = dirname(require.main.filename);
const util = require("util");

//Console print filters
const filters = {
  level: [],
  modules: []
}


//formatting message to logging in console
const myConsoleFormat = winston.format.printf(function (info) {  
  //Display additional params in console if level error+
  if (info.level.includes('error') && info[1]) {
    return `${info.level};${info[0]}: ${info.message};\n vars: ${(info[1])}`;    
  }
  return `${info.level};${info[0]}: ${info.message};`;

});

//unfortunately it is not working in one functinon with 'myConsoleFormat'
const logFilter = winston.format(function (info) {
  if (filters.level.length != 0) {
    if (!filters.level.includes(info.level)) {
      return false;
    }
  }
  if (filters.modules.length != 0 && info[0]) {
    if (!filters.modules.includes(info[0])) {
      return false;
    }
  }
  return info;
});

//setup for logger
var options = {
  file: {
    level: 'info',
    name: 'file.info',
    filename: `${appRoot}/logs/app.log`,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 100,
    timestamp: true
  },
  errorFile: {
    level: 'error',
    name: 'file.error',
    filename: `${appRoot}/logs/error.log`,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 100,
    timestamp: true
  },
  console: {
    level: 'debug',
    format:
      (process.env.NODE_ENV == 'dev' ?
        winston.format.combine(logFilter(), winston.format.colorize(), myConsoleFormat)
        :
        winston.format.combine(winston.format.colorize(), myConsoleFormat))
  },
};

let logger = winston.createLogger({
  transports: [
    new (winston.transports.Console)(options.console),
    new (winston.transports.File)(options.errorFile),
    new (winston.transports.File)(options.file)
  ],
  exitOnError: false
});


module.exports = function (module) {
  var filename = module.id.split(/[\\/]/).pop();
  return {
    info: function (msg, vars) {      
      logger.info(msg, [filename, util.format(vars)]);
    },
    debug: function (msg, vars) {      
      logger.debug(msg, [filename, util.format(vars)]);
    },
    error: function (msg, vars) {      
      logger.error(msg, [filename, util.format(vars)]);
    },
    warning: function (msg, vars) {      
      logger.warn(msg, [filename, util.format(vars)]);
    }
  }
};
