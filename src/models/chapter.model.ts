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
export interface NovelChapter {
  nid: string;
  vid: string;
  cid: string;
  index: number;
  title: string;
  content: string;
  matureContent: boolean;
  createdAt: string;
}

export interface NovelChapterDocument extends NovelChapter, Document {}

/**
 * Declaring the constants.
 */
const chapterSchema = new Schema<NovelChapter>(
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
    vid: {
      type: String
    },
    cid: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
      trim: true
    },
    content: {
      type: String,
      required: true,
      minlength: 3,
      set: formatContent
    },
    matureContent: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

/**
 * Setting up the index.
 */
chapterSchema.index({ cid: 1 }, { name: `<>CID_ALREADY_EXISTS<>`, unique: true });
chapterSchema.index({ nid: 1, index: 1 }, { name: '<>CHAPTER_ALREADY_EXISTS<>', unique: true });

/**
 * Exporting the novel model.
 */
export default model<NovelChapterDocument>('chapters', chapterSchema);
