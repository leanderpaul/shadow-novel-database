/**
 * Importing npm packages.
 */
import uniqid from 'uniqid';

/**
 * Importing user defined packages.
 */
import novelModel from '../models/novel.model';
import * as utils from '../utils';

/**
 * Importing and defining types.
 */
import type { UpdateQuery } from 'mongoose';
import type { Novel } from '../models/novel.model';
import type { IModelUpdate } from '../types';

export type NovelUpdate = Omit<Partial<Novel>, 'views' | 'createdAt' | 'volumes' | 'nid' | 'chapterCount'>;

export type NovelVolumeUpdate = { operation: 'add'; name?: string } | { operation: 'remove'; vid: string };

export type NovelQuery = Partial<Pick<Novel, 'title' | 'genre' | 'uid' | 'tags' | 'status'>>;

export interface NovelFilter {
  sort: {
    field: string;
    order: 'asc' | 'desc';
  };
  limit: number;
  offset: number;
}

export interface UpdateNovelCondition {
  nid: string;
  vid?: string;
}

export type NewNovel = Omit<Novel, 'nid' | 'views' | 'createdAt' | 'volumes' | 'chapterCount'>;

/**
 * Declaring the constants.
 */
const logger = getLogger('shadow-novel-database:novel');

export async function createNovel(newNovel: NewNovel, addVolume: boolean): Promise<Omit<Novel, '_id'>> {
  const volumes = addVolume ? utils.generateVolume() : undefined;
  const novel = await novelModel.create({ nid: utils.generateUUID(), ...newNovel, volumes });
  const novelObj = novel.toObject();
  logger.debug(`db.novels.insert(${novelObj})`);
  delete novelObj._id;
  return novelObj;
}

export async function findById<T extends keyof Novel>(nid: string, projection?: T[]): Promise<Pick<Novel, T> | null> {
  const query = novelModel.findOne({ nid }, projection?.join(' '));
  logger.debug(`db.novels.find(${query.getFilter()})`);
  return await query.lean();
}

export async function findNovels<T extends keyof Novel>(novelQuery: NovelQuery, filter: NovelFilter, projection?: T[]): Promise<Pick<Novel, T>[]> {
  const filterQuery = { ...novelQuery };
  delete filterQuery.tags;
  const query = novelModel.find(filterQuery, projection?.join(' '));
  if (novelQuery.tags) query.where('tags').all(novelQuery.tags);
  query.sort({ [filter.sort.field]: filter.sort.order === 'asc' ? 1 : -1 });
  query.skip(filter.offset);
  query.limit(filter.limit);
  logger.debug(`db.novels.find(${query.getFilter()})`);
  return await query.lean();
}

export async function countNovels(novelQuery: NovelQuery) {
  const filterQuery = { ...novelQuery };
  delete filterQuery.tags;
  const query = novelModel.countDocuments(filterQuery);
  if (novelQuery.tags) query.where('tags').all(novelQuery.tags);
  logger.debug(`db.novels.countDocuments(${query.getFilter()})`);
  return await query;
}

export async function updateNovel(condition: UpdateNovelCondition, updateQuery: UpdateQuery<Omit<Novel, 'nid' | 'author' | 'createdAt' | 'chapterCount'>>) {
  const { nid, vid } = condition;
  const filter = vid ? { nid, 'volumes.vid': vid } : { nid };
  const result: IModelUpdate = await novelModel.updateOne(filter, updateQuery);
  logger.debug(`db.novels.updateOne(${filter}, ${updateQuery})`);
  if (result.n === 0) return 'NOVEL_NOT_FOUND';
  return true;
}

export async function deleteNovel(nid: string) {
  const result = await novelModel.deleteOne({ nid });
  logger.debug(`db.novels.deleteOne(${{ nid }})`);
  if (result.n === 0) return 'NOVEL_NOT_FOUND';
  return true;
}
