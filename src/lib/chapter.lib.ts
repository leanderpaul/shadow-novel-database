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

export type FindChapterQuery = { nid: string } | { vid: string };

export interface FindChapterFilter {
  sortOrder: 'asc' | 'desc';
  offset: number;
  limit: number;
}

/**
 * Declaring the constants.
 */
export async function createChapter(newChapter: Omit<NovelChapter, 'cid' | 'index' | 'createdAt'>): Promise<Omit<NovelChapter, '_id'>> {
  const chapterCount = await chapterModel.countDocuments({ nid: newChapter.nid });
  const chapter = await chapterModel.create<Omit<NovelChapter, 'createdAt'>>({ cid: uniqid.process(), index: chapterCount + 1, ...newChapter });
  await novelModel.updateOne({ nid: newChapter.nid }, { $inc: { chapterCount: 1 } });
  const chapterObj = chapter.toObject();
  delete chapterObj._id;
  return chapterObj;
}

export async function findById<T extends keyof NovelChapter>(cid: string, projection?: T[]): Promise<Pick<NovelChapter, T> | null> {
  return await chapterModel.findOne({ cid }, projection?.join(' ')).lean();
}

export async function findChapters<T extends keyof NovelChapter>(query: FindChapterQuery, filter: FindChapterFilter, projection?: T[]): Promise<Pick<NovelChapter, T>[]> {
  return await chapterModel.find(query, projection?.join(' ')).sort({ index: filter.sortOrder }).skip(filter.offset).limit(filter.limit).lean();
}

export async function countChapters(query: FindChapterFilter) {
  return await chapterModel.countDocuments(query);
}

export async function updateChapter(cid: string, update: ChapterUpdate) {
  const result: IModelUpdate = await chapterModel.updateOne({ cid }, { $set: update });
  if (result.n === 0) return 'CHAPTER_NOT_FOUND';
  return true;
}

export async function deleteChapter(nid: string, cid: string) {
  const result = await chapterModel.deleteOne({ cid, nid });
  if (result.n === 0) return 'CHAPTER_NOT_FOUND';
  await novelModel.updateOne({ nid }, { $inc: { chapterCount: -1 } });
  return true;
}
