/**
 * Importing npm packages.
 */
import uniqid from 'uniqid';

/**
 * Importing user defined packages.
 */
import novelModel, { Novel, NovelStatus } from '../models/novel.model';

/**
 * Importing and defining types.
 */
import type { UpdateQuery, FilterQuery } from 'mongoose';
import type { IModelUpdate } from '../types';

type NovelUpdate = Omit<Partial<Novel>, 'views' | 'createdAt' | 'volumes' | 'nid' | 'chapterCount'>;

type NovelVolumeUpdate = { operation: 'add'; name?: string } | { operation: 'remove'; vid: string };

interface NovelQuery {
  title?: string;
  author?: string;
  status?: NovelStatus;
  genre?: string;
  tags?: string[];
}

interface NovelFilter {
  sort: {
    field: 'views' | 'title' | 'chapterCount' | 'createdAt';
    order: 'asc' | 'desc' | 1 | -1;
  };
  limit?: number;
  offset?: number;
}

interface NovelsPagination<T extends keyof Novel> {
  offset: number;
  limit: number;
  totalCount: number;
  novels: Pick<Novel, T>[];
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

export async function findNovels<T extends keyof Novel>(novelQuery: NovelQuery, novelFilter: NovelFilter, projection?: T[]): Promise<NovelsPagination<T>> {
  let filterQuery: FilterQuery<Novel> = {};
  if (novelQuery.title) filterQuery.title = new RegExp(novelQuery.title, 'i');
  if (novelQuery.author) filterQuery.author = novelQuery.author;
  if (novelQuery.status) filterQuery.status = novelQuery.status;
  if (novelQuery.genre) filterQuery.genre = novelQuery.genre;
  if (novelQuery.tags) filterQuery.tags = { $all: novelQuery.tags };
  const promise = novelModel
    .find(filterQuery, projection?.join(' '))
    .sort(novelFilter.sort)
    .skip(novelFilter.offset || 0)
    .limit(novelFilter.limit || 20);
  const [novels, novelCount] = await Promise.all([promise.lean(), novelModel.countDocuments(filterQuery)]);
  return { limit: novelFilter.limit || 20, novels, offset: novelFilter.offset || 0, totalCount: novelCount };
}

export async function updateNovel(nid: string, update: NovelUpdate, incView: boolean = false, volumeUpdate?: NovelVolumeUpdate) {
  let updateQuery: UpdateQuery<Novel> = {};
  if (incView) updateQuery.$inc = { views: 1 };
  if (volumeUpdate?.operation === 'add') updateQuery.$push = { volumes: { vid: uniqid.process(), name: volumeUpdate.name } };
  if (volumeUpdate?.operation === 'remove') updateQuery.$pull = { volumes: { vid: volumeUpdate.vid } };
  updateQuery.$set = update;
  const result: IModelUpdate = await novelModel.updateOne({ nid }, updateQuery);
  if (result.n === 0) return 'NOVEL_NOT_FOUND';
  return true;
}

export async function deleteNovel(nid: string) {
  const result = await novelModel.deleteOne({ nid });
  if (result.n === 0) return 'NOVEL_NOT_FOUND';
  return true;
}
