/**
 * Importing npm packages.
 */
import uniqid from 'uniqid';
import bcrypt from 'bcryptjs';
import { removeKeys } from '@leanderpaul/ts-utils';

/**
 * Importing user defined packages.
 */
import userModel from '../models/user.models';
import * as utils from '../utils';

/**
 * Importing and defining types.
 */
import type { User } from '../models/user.models';
import type { UpdateQuery } from 'mongoose';
import type { IModelUpdate } from '../types';

export type UserUpdate = Record<keyof Omit<User, 'library'>, string | undefined>;

export interface UserLibraryUpdate {
  nid: string;
  operation: 'add' | 'remove';
}

export type NewUser = Omit<User, 'uid' | '_id' | 'library'>;

/**
 * Declaring the constants.
 */
const logger = getLogger('shadow-novel-database:user');

export async function createUser(newUser: NewUser): Promise<Omit<User, '_id' | 'password'>> {
  newUser.password = utils.hashPassword(newUser.password);
  const user = await userModel.create({ uid: utils.generateUUID(), ...newUser });
  logger.debug(`db.users.insert(${user.toJSON()})`);
  return removeKeys(user.toObject(), ['_id', 'password']);
}

export async function findByUsername<T extends keyof User>(username: string, projection?: T[]): Promise<Pick<User, T> | null> {
  const query = userModel.findOne({ username }, projection?.join(' '));
  logger.debug(`db.users.find(${query.getFilter()})`);
  const user = await query.lean();
  return user;
}

export async function updateUser(username: string, update: UserUpdate, libraryUpdate?: UserLibraryUpdate) {
  let updateQuery: UpdateQuery<User> = {};
  if (update.password) update.password = utils.hashPassword(update.password);
  if (libraryUpdate?.operation === 'add') updateQuery.$push = { library: libraryUpdate.nid };
  if (libraryUpdate?.operation === 'remove') updateQuery.$pull = { library: libraryUpdate.nid };
  updateQuery.$set = update;
  const result: IModelUpdate = await userModel.updateOne({ username }, updateQuery);
  logger.debug(`db.users.updateOne(${{ username }}, ${updateQuery})`);
  if (result.n === 0) return 'USER_NOT_FOUND';
  return true;
}
