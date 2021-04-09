/**
 * Importing npm packages.
 */
import mongoose from 'mongoose';

/**
 * Importing user defined packages.
 */
import { User, UserDocument, UserDBErrors } from './models/user.models';
import { Novel, NovelDocument, NovelVolume, Genres, NovelDBErrors, NovelStatus, Tags } from './models/novel.model';
import { NovelChapter, NovelChapterDocument, ChapterDBErrors } from './models/chapter.model';
import { logger as Logger } from './logger';

import * as userModel from './lib/user.lib';
import * as novelModel from './lib/novel.lib';
import * as chapterModel from './lib/chapter.lib';
import * as DBUtils from './utils';

/**
 * Importing and defining types.
 */

import type { UserLibraryUpdate, UserUpdate } from './lib/user.lib';
import type { NovelFilter, NovelQuery, NovelUpdate, NovelVolumeUpdate, UpdateNovelCondition, NewNovel } from './lib/novel.lib';
import type { ChapterUpdate, FindChapterFilter, FindChapterQuery } from './lib/chapter.lib';

/**
 * Declaring the constants.
 */
const logger = getLogger('shadow-novel-database');
const DB_URI = process.env.DB || 'mongodb://localhost/shadow-novel';

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.connection.on('connected', () => logger.info(`connected to database`));
mongoose.connection.on('error', (err) => logger.error(err));

function disconnect() {
  mongoose.connection.close();
}

/**
 * Exporting the models.
 */
export default { disconnect, logger: Logger };
export { userModel, novelModel, chapterModel, DBUtils };
export { UserDBErrors, NovelDBErrors, ChapterDBErrors, NovelStatus, Genres, Tags };

/**
 * Exporting the types.
 */
export type { User, UserDocument, UserLibraryUpdate, UserUpdate };
export type { Novel, NovelDocument, NovelVolume, NovelFilter, NovelQuery, NovelUpdate, NovelVolumeUpdate, UpdateNovelCondition, NewNovel };
export type { NovelChapter, NovelChapterDocument, ChapterUpdate, FindChapterFilter, FindChapterQuery };
