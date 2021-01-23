/**
 * Importing npm packages.
 */
import uniqid from 'uniqid';
import bcrypt from 'bcryptjs';

/**
 * Importing user defined packages.
 */
import userModel, { User } from '../models/user.models';

/**
 * Importing and defining types.
 */
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

export async function createUser(newUser: NewUser): Promise<Omit<User, '_id' | 'password'>> {
  newUser.password = bcrypt.hashSync(newUser.password, 10);
  const library: string[] = [];
  const user = await userModel.create({ uid: uniqid(), ...newUser, library });
  const userObj = user.toObject();
  delete userObj._id;
  delete userObj.password;
  return userObj;
}

export async function findByUsername<T extends keyof User>(username: string, projection?: T[]): Promise<Pick<User, T> | null> {
  const user = await userModel.findOne({ username }, projection?.join(' ')).lean();
  return user;
}

export async function updateUser(username: string, update: UserUpdate, libraryUpdate?: UserLibraryUpdate) {
  let updateQuery: UpdateQuery<User> = {};
  if (update.password) update.password = bcrypt.hashSync(update.password, 10);
  if (libraryUpdate?.operation === 'add') updateQuery.$push = { library: libraryUpdate.nid };
  if (libraryUpdate?.operation === 'remove') updateQuery.$pull = { library: libraryUpdate.nid };
  updateQuery.$set = update;
  const result: IModelUpdate = await userModel.updateOne({ username }, updateQuery);
  if (result.n === 0) return 'USER_NOT_FOUND';
  return true;
}
