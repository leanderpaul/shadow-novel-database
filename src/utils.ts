/**
 * Importing npm packages.
 */
import uniqid from 'uniqid';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Importing user defined packages.
 */

/**
 * Importing and defining types.
 */

/**
 * Declaring the constants.
 */
const ALGORITHM = 'AES-256-CTR'; // use command `openssl list -cipher-algorithms` to get valid algorithms.
const SECRET_KEY = crypto.randomBytes(64).toString();
const ENCRYPTION_FORMAT = 'hex';

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

export function formatContent(str: string) {
  return str
    .split('\n')
    .filter((para) => para.trim())
    .map((para) =>
      para
        .replace(/[\t\r]/g, '')
        .replace(/[“”]/g, '"')
        .replace(/[’]/g, "'")
    )
    .join('\n');
}

export function generateVolume(name?: string | null) {
  return { vid: uniqid.time(), name, chapterCount: 0 };
}
