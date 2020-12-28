/**
 * Importing npm packages.
 */
import uniqid from 'uniqid';

/**
 * Importing user defined packages.
 */
import novelModel, { Novel } from '../models/novel.model';

/**
 * Importing and defining types.
 */
import type { UpdateQuery } from 'mongoose';
import type { IModelUpdate } from '../types';

export type NovelUpdate = Omit<Partial<Novel>, 'views' | 'createdAt' | 'volumes' | 'nid' | 'chapterCount'>;

export type NovelVolumeUpdate = { operation: 'add'; name?: string } | { operation: 'remove'; vid: string };

export interface NovelQuery {
  title?: string;
  author?: string;
  status?: string;
  genre?: string;
  tags?: string[];
}

export interface NovelFilter {
  sort: {
    field: string;
    order: 'asc' | 'desc';
  };
  limit: number;
  offset: number;
}

/**
 * Declaring the constants.
 */
export async function createNovel(newNovel: Omit<Novel, 'nid' | 'views' | 'createdAt' | 'volumes' | 'chapterCount'>): Promise<Omit<Novel, '_id'>> {
  const novel = await novelModel.create<any>({ nid: uniqid.process(), ...newNovel, volumes: [{ vid: uniqid.process() }] });
  const novelObj = novel.toObject();
  delete novelObj._id;
  return novelObj;
}

export async function findById<T extends keyof Novel>(nid: string, projection?: T[]): Promise<Pick<Novel, T> | null> {
  return await novelModel.findOne({ nid }, projection?.join(' ')).lean();
}

export async function findNovels<T extends keyof Novel>(query: NovelQuery, filter: NovelFilter, projection?: T[]): Promise<Pick<Novel, T>[]> {
  return await novelModel
    .find({ ...query, tags: { $all: query.tags } }, projection?.join(' '))
    .sort(filter.sort)
    .skip(filter.offset)
    .limit(filter.limit)
    .lean();
}

export async function countNovels(query: NovelQuery) {
  return await novelModel.countDocuments({ ...query, tags: { $all: query.tags } });
}

export async function updateNovel(nid: string, update: NovelUpdate | null, incView: boolean = false, volumeUpdate?: NovelVolumeUpdate) {
  let updateQuery: UpdateQuery<Novel> = {};
  if (update) updateQuery.$set = update;
  if (incView) updateQuery.$inc = { views: 1 };
  if (volumeUpdate?.operation === 'add') updateQuery.$push = { volumes: { vid: uniqid.process(), name: volumeUpdate.name } };
  if (volumeUpdate?.operation === 'remove') updateQuery.$pull = { volumes: { vid: volumeUpdate.vid } };
  const result: IModelUpdate = await novelModel.updateOne({ nid }, updateQuery);
  if (result.n === 0) return 'NOVEL_NOT_FOUND';
  return true;
}

export async function deleteNovel(nid: string) {
  const result = await novelModel.deleteOne({ nid });
  if (result.n === 0) return 'NOVEL_NOT_FOUND';
  return true;
}
