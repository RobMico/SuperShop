import winston from 'winston';
import { dirname } from 'path';
import util from 'util';
const appRoot = dirname(require.main.filename);

interface CallerInfo {
  fileName: string;
  functionName: string;
}

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





class LoggerWrap {
  logger = logger;
  getCallerInfo(stackStr: string) {
    const stack = stackStr?.split('\n');
    if (!stack) {
      return null;
    }

    // Get the 3rd element in the stack, which should be the caller function
    const callerStack = stack[2];
    if (!callerStack) {
      return null;
    }
    // Get the function name and file path from the caller stack
    const fileNameMatches = callerStack.match(/[^/]+(?=:)/);
    if (!fileNameMatches) {
      return null;
    }

    const fileName = fileNameMatches[0];

    return fileName;
  }
  info(message: string, meta?: any) {
    if (Array.isArray(meta)) {
      meta.unshift(this.getCallerInfo(new Error().stack));
    }
    else {
      if (meta) {
        meta = [this.getCallerInfo(new Error().stack), meta];
      }
      else {
        meta = [this.getCallerInfo(new Error().stack)];
      }
    }
    this.logger.info(message, meta);
  }
  error(message: string, meta?: any) {
    if (Array.isArray(meta)) {
      meta.unshift(this.getCallerInfo(new Error().stack));
    }
    else {
      if (meta) {
        meta = [this.getCallerInfo(new Error().stack), meta];
      }
      else {
        meta = [this.getCallerInfo(new Error().stack)];
      }
    }
    this.logger.error(message, meta);
  }
  warn(message: string, meta?: any) {
    if (Array.isArray(meta)) {
      meta.unshift(this.getCallerInfo(new Error().stack));
    }
    else {
      if (meta) {
        meta = [this.getCallerInfo(new Error().stack), meta];
      }
      else {
        meta = [this.getCallerInfo(new Error().stack)];
      }
    }
    this.logger.warn(message, meta);
  }
  debug(message: string, meta?: any) {
    if (Array.isArray(meta)) {
      meta.unshift(this.getCallerInfo(new Error().stack));
    }
    else {
      if (meta) {
        meta = [this.getCallerInfo(new Error().stack), meta];
      }
      else {
        meta = [this.getCallerInfo(new Error().stack)];
      }
    }
    this.logger.debug(message, meta);
  }
}


export default new LoggerWrap();