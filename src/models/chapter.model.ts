/**
 * Importing npm packages.
 */
import { Schema, model, Document } from 'mongoose';

/**
 * Importing user defined packages.
 */
import { formatContent } from '../utils';

/**
 * Importing and defining types.
 */
export enum ChapterDBErrors {
  NID_REQUIRED = 'NID_REQUIRED',
  CID_REQUIRED = 'CID_REQUIRED',
  CHAPTER_INDEX_REQUIRED = 'CHAPTER_INDEX_REQUIRED',
  CHAPTER_TITLE_REQUIRED = 'CHAPTER_TITLE_REQUIRED',
  CHAPTER_TITLE_INVALID = 'CHAPTER_TITLE_INVALID',
  CHAPTER_CONTENT_REQUIRED = 'CHAPTER_CONTENT_REQUIRED',
  CHAPTER_CONTENT_INVALID = 'CHAPTER_CONTENT_INVALID'
}

export interface NovelChapter {
  nid: string;
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
const chapterSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
      select: false
    },
    nid: {
      type: String,
      required: ChapterDBErrors.NID_REQUIRED
    },
    cid: {
      type: String,
      required: ChapterDBErrors.CID_REQUIRED
    },
    index: {
      type: Number,
      required: ChapterDBErrors.CHAPTER_INDEX_REQUIRED
    },
    title: {
      type: String,
      required: ChapterDBErrors.CHAPTER_TITLE_REQUIRED,
      validate: [/^[\w\d\ @#$&\-_'"]{3,64}$/, ChapterDBErrors.CHAPTER_TITLE_INVALID],
      trim: true
    },
    content: {
      type: String,
      required: true,
      validate: [/^[\w\d\ @#$&\-_'"]{3,}$/, ChapterDBErrors.CHAPTER_TITLE_INVALID],
      set: formatContent
    },
    matureContent: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: { updatedAt: false },
    versionKey: false,
    _id: false
  }
);

/**
 * Setting up the index.
 */
chapterSchema.index({ nid: 1, cid: 1 }, { name: `<>CID_ALREADY_EXISTS<>`, unique: true });
chapterSchema.index({ nid: 1, index: 1 }, { name: '<>CHAPTER_ALREADY_EXISTS<>', unique: true });

/**
 * Exporting the novel model.
 */
export default model<NovelChapterDocument>('chapters', chapterSchema);
