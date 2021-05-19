/**
 * Importing npm packages.
 */
import winston from 'winston';

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
const consoleFormat = printf(({ level, message, timestamp, service }) => `${timestamp} ${level}: [${service}] ${message}`);
const consoleColor = colorize({ level: true, colors: { info: 'green', error: 'bold red', warn: 'italic yellow', debug: 'magenta', http: 'blue' } });
const jsonFormat = combine(timestamp({ format: 'DD-MM-YY HH:mm:ss:SS' }), errors({ stack: true }), json());
const consoleLogFormat = combine(timestamp({ format: 'HH:mm:ss:SS' }), errors({ stack: true }), consoleColor, consoleFormat);
const fileTransport = new winston.transports.File({ filename: `${appName}.log`, options: { flags: 'w' } });

const logger = winston.createLogger({ level: logLevel, format: jsonFormat, transports: [fileTransport] });

if (process.env.NODE_ENV != 'production') logger.add(new winston.transports.Console({ format: consoleLogFormat }));

global.getLogger = function (metadata) {
  if (typeof metadata === 'string') return logger.child({ service: metadata });
  return logger.child({ ...metadata });
};

export { logger };
