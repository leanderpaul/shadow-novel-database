/**
 * Importing npm packages.
 */
import mongoose from 'mongoose';

/**
 * Importing user defined packages.
 */
import * as userModel from './lib/user.lib';
import * as novelModel from './lib/novel.lib';
import * as chapterModel from './lib/chapter.lib';
import { logger } from './logger';

/**
 * Importing and defining types.
 */

/**
 * Declaring the constants.
 */
const dbUri = process.env.DB || 'mongodb://localhost/shadow-novel';

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.connection.on('connected', () => logger.info(`connected to ${dbUri}`));
mongoose.connection.on('error', (err) => logger.error(err));

/**
 * Exporting the models.
 */
export { userModel, novelModel, chapterModel };
