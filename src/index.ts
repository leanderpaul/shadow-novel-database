/**
 * Importing npm packages.
 */
import mongoose from 'mongoose';

/**
 * Importing user defined packages.
 */
import { User, UserDocument } from './models/user.models';
import { Novel, NovelDocument, NovelVolume } from './models/novel.model';
import { NovelChapter, NovelChapterDocument } from './models/chapter.model';

import * as userModel from './lib/user.lib';
import * as novelModel from './lib/novel.lib';
import * as chapterModel from './lib/chapter.lib';
import * as dbUtils from './utils';
import { logger } from './logger';

/**
 * Importing and defining types.
 */

import type { UserLibraryUpdate, UserUpdate } from './lib/user.lib';
import type { NovelFilter, NovelQuery, NovelUpdate, NovelVolumeUpdate, UpdateNovelCondition } from './lib/novel.lib';
import type { ChapterUpdate, FindChapterFilter, FindChapterQuery } from './lib/chapter.lib';

/**
 * Declaring the constants.
 */
const dbUri = process.env.DB || 'mongodb://localhost/shadow-novel';

function connect() {
  mongoose.connect(dbUri, { authSource: 'admin', useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
  mongoose.connection.on('connected', () => logger.info(`connected to ${dbUri}`));
  mongoose.connection.on('error', (err) => logger.error(err));
}

function disconnect() {
  mongoose.connection.close();
}

/**
 * Exporting the models.
 */
export default { disconnect, connect };
export { userModel, novelModel, chapterModel, dbUtils };

/**
 * Exporting the types.
 */
export type { User, UserDocument, UserLibraryUpdate, UserUpdate };
export type { Novel, NovelDocument, NovelVolume, NovelFilter, NovelQuery, NovelUpdate, NovelVolumeUpdate, UpdateNovelCondition };
export type { NovelChapter, NovelChapterDocument, ChapterUpdate, FindChapterFilter, FindChapterQuery };
