/**
 * Importing npm packages.
 */
import { Schema, model, Document } from 'mongoose';

/**
 * Importing user defined packages.
 */

/**
 * Importing and defining types.
 */
export enum UserDBErrors {
  UID_REQUIRED = 'UID_REQUIRED',
  USERNAME_REQUIRED = 'USERNAME_REQUIRED',
  USERNAME_INVALID = 'USERNAME_INVALID',
  FIRST_NAME_INVALID = 'FIRST_NAME_INVALID',
  LAST_NAME_INVALID = 'LAST_NAME_INVALID',
  PASSWORD_REQUIRED = 'PASSWORD_REQUIRED',
  PASSWORD_INVALID = 'PASSWORD_INVALID',
  USERNAME_ALREADY_EXISTS = 'USERNAME_ALREADY_EXISTS',
  PASSWORD_NOT_HASHED = 'PASSWORD_NOT_HASHED',
  WEBNOVEL_COOKIE_INVALID = 'WEBNOVEL_COOKIE_INVALID'
}

export interface User {
  uid: string;
  username: string;
  firstName?: string;
  lastName?: string;
  password: string;
  library: string[];
  webnovelCookie?: string;
}

export interface UserDocument extends User, Document {}

/**
 * Declaring the constants.
 */
const userSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
      select: false
    },
    uid: {
      type: String,
      required: UserDBErrors.UID_REQUIRED,
      immitable: true
    },
    username: {
      type: String,
      validate: [/^[a-zA-Z0-9-_@]{3,32}$/, UserDBErrors.USERNAME_INVALID],
      required: UserDBErrors.USERNAME_REQUIRED,
      immitable: true
    },
    firstName: {
      type: String,
      validate: [/^([a-zA-Z\ ]){3,32}$/, UserDBErrors.FIRST_NAME_INVALID],
      trim: true
    },
    lastName: {
      type: String,
      validate: [/^([a-zA-Z\ ]){3,32}$/, UserDBErrors.LAST_NAME_INVALID],
      trim: true
    },
    password: {
      type: String,
      validate: [/^[^]{60}$/, UserDBErrors.PASSWORD_NOT_HASHED],
      required: UserDBErrors.PASSWORD_REQUIRED
    },
    library: {
      type: [String],
      required: true
    },
    webnovelCookie: {
      type: String,
      validate: [/_csrfToken=/, UserDBErrors.WEBNOVEL_COOKIE_INVALID]
    }
  },
  {
    versionKey: false,
    timestamps: { updatedAt: false }
  }
);

/**
 * Setting up the indexes.
 */
userSchema.index({ username: 1 }, { name: `<>USERNAME_ALREADY_EXISTS<>`, unique: true });
userSchema.index({ uid: 1 }, { name: '<>USER_UID<>', unique: true });

/**
 * Exporting the user model.
 */
const userModel = model<UserDocument>('users', userSchema);
export default userModel;
export { userModel };
