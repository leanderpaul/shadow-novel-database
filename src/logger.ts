/**
 * Importing npm packages.
 */
import winston from 'winston';
import 'winston-daily-rotate-file';

/**
 * Importing user defined packages.
 */

/**
 * Importing and defining types.
 */
import type { Logger } from 'winston';

declare global {
  function getLogger(metadata: string | Record<string, any>): Logger;
}

/**
 * Declaring the constants.
 */
const { combine, printf, errors, timestamp, colorize, json } = winston.format;
const VALID_LOG_LEVELS = ['debug', 'http', 'info', 'warn', 'error'];
const appName = process.env.APP_NAME || 'nodejs-app';
const logLevel = VALID_LOG_LEVELS.includes(process.env.LOG_LEVEL || '') ? process.env.LOG_LEVEL : 'http';
const filename = 'logs/application-log-%DATE%.log';
const consoleFormat = printf(({ level, message, timestamp, service }) => `${timestamp} ${level}: [${service}] ${message}`);
const consoleColor = colorize({ level: true, colors: { info: 'green', error: 'bold red', warn: 'italic yellow', debug: 'magenta', http: 'blue' } });
const fileLlogFormat = combine(timestamp({ format: 'DD-MM-YY HH:mm:ss:SS' }), errors({ stack: true }), json());
const consoleLogFormat = combine(timestamp({ format: 'HH:mm:ss:SS' }), errors({ stack: true }), consoleColor, consoleFormat);
const fileTransport = new winston.transports.DailyRotateFile({ filename, datePattern: 'YY-MM-DD_kk-mm-ss', format: fileLlogFormat, maxSize: '100m' });

const logger = winston.createLogger({
  level: logLevel,
  transports: [fileTransport]
});

if (process.env.NODE_ENV != 'production') logger.add(new winston.transports.Console({ format: consoleLogFormat }));

global.getLogger = function (metadata) {
  if (typeof metadata === 'string') return logger.child({ appName, service: metadata });
  return logger.child({ appName, ...metadata });
};

export { logger };
