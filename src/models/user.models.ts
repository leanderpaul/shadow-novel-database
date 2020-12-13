/**
 * Importing npm packages.
 */
import { Schema, model, Types, Document } from 'mongoose';

/**
 * Importing user defined packages.
 */

/**
 * Importing and defining types.
 */
export interface User {
  uid: string;
  username: string;
  firstName?: string;
  lastName?: string;
  password: string;
  library: string[];
}

export interface UserDocument extends User, Document {}

/**
 * Declaring the constants.
 */
const userSchema = new Schema<User>(
  {
    _id: {
      type: Types.ObjectId,
      auto: true,
      select: false
    },
    uid: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      minlength: 3,
      maxlength: 32,
      trim: true
    },
    lastName: {
      type: String,
      minlength: 3,
      maxlength: 32,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    library: {
      type: [String],
      required: true
    }
  },
  {
    _id: false,
    versionKey: false
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
export default model<UserDocument>('users', userSchema);
