/**
 * Importing npm packages.
 */
import uniqid from 'uniqid';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Importing user defined packages.
 */
import { UserDBErrors } from './models/user.models';

/**
 * Importing and defining types.
 */
import type { NovelDesc, Novel } from './models/novel.model';

interface EditorJSBlock {
  type: string;
  data: {
    text: string;
  };
}

/**
 * Declaring the constants.
 */
const ALGORITHM = 'AES-256-CTR'; // use command `openssl list -cipher-algorithms` to get valid algorithms.
const SECRET_KEY = crypto.randomBytes(64).toString();
const ENCRYPTION_FORMAT = 'hex';
const PASSWORD_REGEX = /^[a-zA-Z0-9@$#!]{8,32}$/;

/**
 * Generates a unique identifier using hex code and -.
 * @param prefix
 * @param suffix
 * @returns
 */
export function generateUUID() {
  const uuidAscii = uniqid.time();
  let uuidDecimal = '';
  for (let index = 0; index < uuidAscii.length; index++) uuidDecimal += uuidAscii.charCodeAt(index);
  return uuidDecimal;
}

/**
 * Generates a random hex token.
 * @param size The size of the token.
 * @returns
 */
export function generateToken(size: number = 32) {
  return crypto.randomBytes(size).toString('hex');
}

/**
 * hashes the passeord.
 * @param password
 * @returns
 */
export function hashPassword(password: string) {
  const isPasswordValid = PASSWORD_REGEX.test(password);
  if (!isPasswordValid) throw UserDBErrors.PASSWORD_INVALID;
  return bcrypt.hashSync(password, 10);
}

/**
 * Compares whether the hashed password and password are the same.
 * @param password
 * @param hashedPassword
 * @returns
 */
export function comparePassword(password: string, hashedPassword: string) {
  return bcrypt.compareSync(password, hashedPassword);
}

/**
 * Encrypts the data.
 * @param data
 * @returns
 */
export function encrypt(data: string) {
  const iv = crypto.randomBytes(32);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  const encryptedStr = Buffer.concat([cipher.update(data), cipher.final()]);
  return { iv: iv.toString(ENCRYPTION_FORMAT), encryptedStr: encryptedStr.toString(ENCRYPTION_FORMAT) };
}

/**
 * Decrypts the data.
 * @param iv
 * @param encryptedStr
 * @returns
 */
export function decrypt(iv: string, encryptedStr: string) {
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, Buffer.from(iv, ENCRYPTION_FORMAT));
  const data = Buffer.concat([decipher.update(Buffer.from(encryptedStr, ENCRYPTION_FORMAT)), decipher.final()]);
  return data.toString();
}

/**
 * Convert Editor.js output to novel description schema.
 */
export function convertEditorTags(blocks: EditorJSBlock[]) {
  const output: NovelDesc[] = [];
  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index];
    output.push({ tag: block.type === 'paragraph' ? 'p' : 'strong', text: block.data.text });
  }
  return output;
}

/**
 * Removes and replaces unneccessary and other characters.
 */
export function formatText(str: string) {
  return str
    .split('\n')
    .filter((para) => para.trim())
    .map((para) =>
      para
        .replace(/[\t\r]/g, '')
        .replace(/[“”]/g, '"')
        .replace(/[’]/g, "'")
    )
    .join(' ');
}

/**
 * Generates a volume sub document.
 */
export function generateVolume(name?: string | null) {
  return { vid: generateUUID(), name: name || undefined, chapterCount: 0 };
}

/**
 * Find the type of novel.
 */
export function findNovelType(novel: Pick<Novel, 'volumes'>) {
  return novel.volumes ? 'book' : 'series';
}
