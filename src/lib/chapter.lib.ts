/**
 * Importing npm packages.
 */
import uniqid from 'uniqid';

/**
 * Importing user defined packages.
 */
import novelModel from '../models/novel.model';
import chapterModel, { NovelChapter } from '../models/chapter.model';
import { logQuery, logger } from '../logger';

/**
 * Importing and defining types.
 */
import type { IModelUpdate } from '../types';

export type ChapterUpdate = Pick<Partial<NovelChapter>, 'title' | 'content' | 'matureContent'>;

export interface FindChapterQuery {
  nid: string;
  cid: string;
}

export interface FindChapterFilter {
  sortOrder: 'asc' | 'desc';
  offset: number;
  limit?: number;
}

export type NewChapter = Omit<NovelChapter, 'cid' | 'index' | 'createdAt'>;

/**
 * Declaring the constants.
 */
export async function createChapter(newChapter: NewChapter): Promise<Omit<NovelChapter, '_id'>> {
  const chapterCount = await chapterModel.countDocuments({ nid: newChapter.nid });
  const chapter = await chapterModel.create<Omit<NovelChapter, 'createdAt'>>({ cid: uniqid.process(), index: chapterCount + 1, ...newChapter });
  const chapterObj = chapter.toObject();
  logger.info(`db.chapters.insert(${chapterObj})`);
  delete chapterObj._id;
  return chapterObj;
}

export async function findById<T extends keyof NovelChapter>(chapterQuery: FindChapterQuery, projection?: T[]): Promise<Pick<NovelChapter, T> | null> {
  const query = chapterModel.findOne(chapterQuery, projection?.join(' '));
  logQuery('chapters', query);
  return await query.lean();
}

export async function findChapters<T extends keyof NovelChapter>(nid: string, filter: FindChapterFilter, projection?: T[]): Promise<Pick<NovelChapter, T>[]> {
  const query = chapterModel.find({ nid }, projection?.join(' ')).sort({ index: filter.sortOrder }).skip(filter.offset);
  if (filter.limit) query.limit(filter.limit);
  logQuery('chapters', query);
  return await query.lean();
}

export async function countChapters(nid: string) {
  const query = chapterModel.countDocuments({ nid });
  logQuery('chapters', query);
  return await query;
}

export async function updateChapter(query: FindChapterQuery, update: ChapterUpdate) {
  const updateQuery = { $set: update };
  const result: IModelUpdate = await chapterModel.updateOne(query, updateQuery);
  logger.info(`db.chapters.updateOne(${query}, ${updateQuery})`);
  if (result.n === 0) return 'CHAPTER_NOT_FOUND';
  return true;
}

export async function deleteChapter(query: FindChapterQuery) {
  const result = await chapterModel.deleteOne(query);
  logger.info(`db.chapters.deleteOne(${query})`);
  if (result.n === 0) return 'CHAPTER_NOT_FOUND';
  const novelQuery = { nid: query.nid };
  const updateQuery = { $inc: { chapterCount: -1 } };
  await novelModel.updateOne(novelQuery, updateQuery);
  logger.info(`db.novels.updateOne(${novelQuery}, ${updateQuery})`);
  return true;
}
