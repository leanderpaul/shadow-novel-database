/**
 * Importing npm packages.
 */
import uniqid from 'uniqid';

/**
 * Importing user defined packages.
 */
import novelModel from '../models/novel.model';
import chapterModel, { NovelChapter } from '../models/chapter.model';

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
  delete chapterObj._id;
  return chapterObj;
}

export async function findById<T extends keyof NovelChapter>(query: FindChapterQuery, projection?: T[]): Promise<Pick<NovelChapter, T> | null> {
  return await chapterModel.findOne(query, projection?.join(' ')).lean();
}

export async function findChapters<T extends keyof NovelChapter>(nid: string, filter: FindChapterFilter, projection?: T[]): Promise<Pick<NovelChapter, T>[]> {
  const documentQuery = chapterModel.find({ nid }, projection?.join(' ')).sort({ index: filter.sortOrder }).skip(filter.offset);
  if (filter.limit) documentQuery.limit(filter.limit);
  return await documentQuery.lean();
}

export async function countChapters(nid: string) {
  return await chapterModel.countDocuments({ nid });
}

export async function updateChapter(query: FindChapterQuery, update: ChapterUpdate) {
  const result: IModelUpdate = await chapterModel.updateOne(query, { $set: update });
  if (result.n === 0) return 'CHAPTER_NOT_FOUND';
  return true;
}

export async function deleteChapter(query: FindChapterQuery) {
  const result = await chapterModel.deleteOne(query);
  if (result.n === 0) return 'CHAPTER_NOT_FOUND';
  await novelModel.updateOne({ nid: query.nid }, { $inc: { chapterCount: -1 } });
  return true;
}
