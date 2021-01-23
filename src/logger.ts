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
import type { Query } from 'mongoose';

type Collection = 'users' | 'novels' | 'chapters';

/**
 * Declaring the constants.
 */
const fileTransport = new winston.transports.File({ filename: 'logs/shadow-novel-database.log' });
const consoleTransport = new winston.transports.Console();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json()
});

if (process.env.NODE_ENV === 'production') logger.add(fileTransport);
else logger.add(consoleTransport);

function logQuery<T>(collection: Collection, query: Query<T>) {
  logger.info(`db.${collection}.find(${query.getFilter()})`);
}

export { logQuery, logger };
