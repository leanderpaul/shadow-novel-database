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
export enum NovelDBErrors {
  NID_REQUIRED = 'NID_REQUIRED',
  NOVEL_TITLE_REQUIRED = 'NOVEL_TITLE_REQUIRED',
  NOVEL_TITLE_INVALID = 'NOVEL_TITLE_INVALID',
  UID_REQUIRED = 'AUTHOR_REQUIRED',
  DESC_REQUIRED = 'DESC_REQUIRED',
  DESC_TEXT_REQUIRED = 'DESC_TEXT_REQUIRED',
  DESC_TAG_INVALID = 'DESC_TAG_INVALID',
  STATUS_REQUIRED = 'STATUS_REQUIRED',
  STATUS_INVALID = 'STATUS_INVALID',
  GENRE_REQUIRED = 'GENRE_REQUIRED',
  GENRE_INVALID = 'GENRE_INVALID',
  TAGS_REQUIRED = 'TAGS_REQUIRED',
  TAGS_INVALID = 'TAGS_INVALID',
  VID_REQUIRED = 'VID_REQUIRED',
  VOLUME_NAME_INVALID = 'VAOLUME_NAME_INVALID',
  VOLUME_CHAPTER_COUNT_REQUIRED = 'VOLUME_CHAPTER_COUNT_REQUIRED'
}

export enum NovelStatus {
  COMPLETED = 'COMPLETED',
  ONGOING = 'ONGOING'
}

export enum Genres {
  CONTEMPORARY_ROMANCE = 'CONTEMPORARY_ROMANCE',
  FANTASY = 'FANTASY',
  FANTASY_ROMANCE = 'FANTASY_ROMANCE',
  MAGICAL_REALISM = 'MAGICAL_REALISM',
  SCI_FI = 'SCI_FI',
  XIANXIA = 'XIANXIA'
}

export enum Tags {
  ACTION = 'ACTION',
  ADULT = 'ADULT',
  ADVENTURE = 'ADVENTURE',
  COMEDY = 'COMEDY',
  DRAMA = 'DRAMA',
  ECCHI = 'ECCHI',
  FANTASY = 'FANTASY',
  FEMALE_PROTAGONIST = 'FEMALE_PROTAGONIST',
  GENDER_BENDER = 'GENDER_BENDER',
  HAREM = 'HAREM',
  HISTORICAL = 'HISTORICAL',
  HORROR = 'HORROR',
  JOSEI = 'JOSEI',
  MALE_PROTAGONIST = 'MALE_PROTAGONIST',
  MARTIAL_ARTS = 'MARTIAL_ARTS',
  MATURE = 'MATURE',
  MECHA = 'MECHA',
  MYSTERY = 'MYSTERY',
  PSYCHOLOGICAL = 'PSYCHOLOGICAL',
  ROMANCE = 'ROMANCE',
  R_18 = 'R_18',
  SCHOOL_LIFE = 'SCHOOL_LIFE',
  SCI_FI = 'SCI_FI',
  SEINEN = 'SEINEN',
  SHOUJO = 'SHOUJO',
  SHOUJO_AI = 'SHOUJO_AI',
  SHOUNEN = 'SHOUNEN',
  SHOUNEN_AI = 'SHOUNEN_AI',
  SLICE_OF_LIFE = 'SLICE_OF_LIFE',
  SMUT = 'SMUT',
  SPORTS = 'SPORTS',
  SUPERNATURAL = 'SUPERNATURAL',
  TRAGEDY = 'TRAGEDY',
  WUXIA = 'WUXIA',
  XIANXIA = 'XIANXIA',
  XUANHUAN = 'XUANHUAN',
  YAOI = 'YAOI',
  YURI = 'YURI'
}

export interface NovelDesc {
  tag: 'p' | 'strong';
  text: string;
}

export interface NovelVolume {
  vid: string;
  name?: string;
  chapterCount: number;
}

export interface Novel {
  nid: string;
  cover?: string;
  title: string;
  uid: string;
  desc: NovelDesc[];
  status: NovelStatus;
  genre: Genres;
  tags: Tags[];
  volumes?: NovelVolume[];
  views: number;
  chapterCount: number;
  createdAt: Date;
}

export interface NovelDocument extends Novel, Document {}

/**
 * Declaring the constants.
 */
const descSchema = new Schema(
  {
    tag: {
      type: String,
      enum: {
        values: ['p', 'strong'],
        message: NovelDBErrors.DESC_TAG_INVALID
      },
      default: 'p'
    },
    text: {
      type: String,
      required: NovelDBErrors.DESC_TEXT_REQUIRED
    }
  },
  { _id: false }
);

const volumeSchema = new Schema(
  {
    vid: {
      type: String,
      required: NovelDBErrors.VID_REQUIRED
    },
    name: {
      type: String,
      validate: [/^([a-zA-Z\ ]){3,32}$/, NovelDBErrors.VOLUME_NAME_INVALID]
    },
    chapterCount: {
      type: Number,
      required: NovelDBErrors.VOLUME_CHAPTER_COUNT_REQUIRED
    }
  },
  { _id: false }
);

const novelSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
      select: false
    },
    nid: {
      type: String,
      required: NovelDBErrors.NID_REQUIRED
    },
    title: {
      type: String,
      required: NovelDBErrors.NOVEL_TITLE_REQUIRED,
      validate: [/^[^]{3,128}$/, NovelDBErrors.NOVEL_TITLE_INVALID],
      trim: true
    },
    cover: {
      type: String
    },
    uid: {
      type: String,
      required: NovelDBErrors.UID_REQUIRED
    },
    desc: {
      type: [descSchema],
      required: NovelDBErrors.DESC_REQUIRED
    },
    status: {
      type: String,
      required: NovelDBErrors.STATUS_REQUIRED,
      enum: {
        values: Object.keys(NovelStatus),
        message: NovelDBErrors.STATUS_INVALID
      }
    },
    genre: {
      type: String,
      required: NovelDBErrors.GENRE_REQUIRED,
      enum: {
        values: Object.keys(Genres),
        message: NovelDBErrors.GENRE_INVALID
      }
    },
    tags: {
      type: [String],
      required: NovelDBErrors.TAGS_REQUIRED,
      enum: {
        values: Object.keys(Tags),
        message: NovelDBErrors.TAGS_INVALID
      }
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
  {
    timestamps: { updatedAt: false },
    versionKey: false,
    _id: false
  }
);

/**
 * Setting up the index.
 */
novelSchema.index({ nid: 1 }, { name: `<>NID_INDEX<>`, unique: true });
novelSchema.index({ uid: 1, nid: 1 }, { name: `<>UID_NID_COMPOUND_INDEX<>`, unique: true });

/**
 * Exporting the novel model.
 */
const novelModel = model<NovelDocument>('novels', novelSchema);
export default novelModel;
export { novelModel };
