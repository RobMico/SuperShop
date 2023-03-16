import winston from 'winston';
import { dirname } from 'path';
import util from 'util';
const appRoot = dirname(require.main.filename);

//setup for logger
var options = {
    file: {
        level: 'info',
        name: 'file.info',
        filename: `${appRoot}/logs/dbLogs.log`,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 100,
        timestamp: true
    },
    errorFile: {
        level: 'error',
        name: 'file.error',
        filename: `${appRoot}/logs/dbLogs.log`,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 100,
        timestamp: true
    }
};

let logger = winston.createLogger({
    transports: [
        new (winston.transports.File)(options.errorFile),
        new (winston.transports.File)(options.file)
    ],
    exitOnError: false,
});

export default logger;
