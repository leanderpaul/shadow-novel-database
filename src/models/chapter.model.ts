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
export enum ChapterDBErrors {
  NID_REQUIRED = 'NID_REQUIRED',
  CID_REQUIRED = 'CID_REQUIRED',
  CHAPTER_INDEX_REQUIRED = 'CHAPTER_INDEX_REQUIRED',
  CHAPTER_TITLE_REQUIRED = 'CHAPTER_TITLE_REQUIRED',
  CHAPTER_TITLE_INVALID = 'CHAPTER_TITLE_INVALID',
  CHAPTER_CONTENT_REQUIRED = 'CHAPTER_CONTENT_REQUIRED',
  CHAPTER_CONTENT_TEXT_REQUIRED = 'CHAPTER_CONTENT_TEXT_REQUIRED',
  CHAPTER_CONTENT_TAG_INVALID = 'CHAPTER_CONTENT_TAG_INVALID'
}

export interface ChapterContent {
  tag: 'p' | 'strong';
  text: string;
}

export interface NovelChapter {
  nid: string;
  vid?: string;
  cid: string;
  index: number;
  title: string;
  content: ChapterContent[];
  matureContent: boolean;
  createdAt: string;
}

export interface NovelChapterDocument extends NovelChapter, Document {}

/**
 * Declaring the constants.
 */
const contentSchema = new Schema(
  {
    tag: {
      type: String,
      enum: {
        values: ['p', 'strong'],
        message: ChapterDBErrors.CHAPTER_CONTENT_TAG_INVALID
      },
      default: 'p'
    },
    text: {
      type: String,
      required: ChapterDBErrors.CHAPTER_CONTENT_TEXT_REQUIRED
    }
  },
  { _id: false }
);

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
    vid: {
      type: String
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
      validate: [/^[^]{3,64}$/, ChapterDBErrors.CHAPTER_TITLE_INVALID],
      trim: true
    },
    content: {
      type: [contentSchema],
      required: ChapterDBErrors.CHAPTER_CONTENT_REQUIRED
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
const chapterModel = model<NovelChapterDocument>('chapters', chapterSchema);
export default chapterModel;
export { chapterModel };
