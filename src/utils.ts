/**
 * Importing npm packages.
 */
import bcrypt from 'bcryptjs';
import uniqid from 'uniqid';

/**
 * Importing user defined packages.
 */

/**
 * Importing and defining types.
 */

/**
 * Declaring the constants.
 */

export function comparePassword(password: string, hashedPassword: string) {
  return bcrypt.compareSync(password, hashedPassword);
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
  return { vid: uniqid.process(), name, chapterCount: 0 };
}
