import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'shadow-novel-database' },
  transports: [new winston.transports.File({ filename: 'shadow-novel-database.log' })],
  silent: true
});
