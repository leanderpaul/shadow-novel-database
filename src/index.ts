/**
 * Importing npm packages.
 */
import mongoose from 'mongoose';

/**
 * Importing user defined packages.
 */
import { userModel, UserDBErrors } from './models/user.models';
import { novelModel, Genres, NovelDBErrors, NovelStatus, Tags } from './models/novel.model';
import { chapterModel, ChapterDBErrors } from './models/chapter.model';
import './logger';

// import * as userModel from './lib/user.lib';
// import * as novelModel from './lib/novel.lib';
// import * as chapterModel from './lib/chapter.lib';
import * as DBUtils from './utils';

/**
 * Importing and defining types.
 */
import type { User, UserDocument } from './models/user.models';
import type { Novel, NovelDocument, NovelVolume } from './models/novel.model';
import type { NovelChapter, NovelChapterDocument } from './models/chapter.model';
// import type { UserLibraryUpdate, UserUpdate } from './lib/user.lib';
// import type { NovelFilter, NovelQuery, NovelUpdate, NovelVolumeUpdate, UpdateNovelCondition, NewNovel } from './lib/novel.lib';
// import type { ChapterUpdate, FindChapterFilter, FindChapterQuery } from './lib/chapter.lib';

/**
 * Declaring the constants.
 */
const dbLogger = getLogger('shadow-novel-database');
const DB_URI = process.env.DB || 'mongodb://localhost/shadow-novel';

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.connection.on('connected', () => dbLogger.info(`connected to database`));
mongoose.connection.on('error', (err) => dbLogger.error(err));

async function disconnect() {
  mongoose.connection.close();
  dbLogger.info(`db connection closed`);
}

/**
 * Exporting the models.
 */
export default { disconnect };
export { userModel, novelModel, chapterModel, DBUtils };
export { UserDBErrors, NovelDBErrors, ChapterDBErrors, NovelStatus, Genres, Tags };

/**
 * Exporting the types.
 */
export type { User, UserDocument };
export type { Novel, NovelDocument, NovelVolume };
export type { NovelChapter, NovelChapterDocument };
