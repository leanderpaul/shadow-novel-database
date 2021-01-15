/**
 * Importing npm packages.
 */
import { Schema, model, Types, Document } from 'mongoose';

/**
 * Importing user defined packages.
 */
import { formatContent } from '../utils';

/**
 * Importing and defining types.
 */
export interface NovelVolume {
  vid: string;
  name?: string;
}

export interface Novel {
  nid: string;
  cover?: string;
  title: string;
  author: string;
  desc: string;
  status: string;
  genre: string;
  tags: string[];
  volumes?: NovelVolume[];
  views: number;
  chapterCount: number;
  createdAt: Date;
}

export interface NovelDocument extends Novel, Document {}

/**
 * Declaring the constants.
 */
const volumeSchema = new Schema<NovelVolume>(
  {
    vid: {
      type: String,
      required: true
    },
    name: {
      type: String,
      minlength: 3,
      maxlength: 32
    }
  },
  { _id: false }
);

const novelSchema = new Schema<Novel>(
  {
    _id: {
      type: Types.ObjectId,
      auto: true,
      select: false
    },
    nid: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 128,
      trim: true
    },
    cover: {
      type: String
    },
    author: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      minlength: 3,
      maxlength: 1000,
      set: formatContent
    },
    status: {
      type: String,
      enum: ['completed', 'ongoing'],
      required: true
    },
    genre: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      required: true
    },
    volumes: {
      type: [volumeSchema]
    },
    views: {
      type: Number,
      default: 0
    },
    chapterCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: { updatedAt: false } }
);

/**
 * Setting up the index.
 */
novelSchema.index({ nid: 1 }, { name: `<>NID_ALREADY_EXISTS<>`, unique: true });

/**
 * Exporting the novel model.
 */
export default model<NovelDocument>('novels', novelSchema);
