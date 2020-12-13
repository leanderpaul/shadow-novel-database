/*!
 * This script will
 *    - Copy the contents of root package.json to dist after adjusting.
 *    - Copy the other needed files into dist folder for publish.
 */
const fs = require('fs');

const distDir = `${__dirname}/../dist`;
const rootDir = `${__dirname}/..`;
const packageJson = require('../package.json');

packageJson.private = false;
delete packageJson.scripts;
packageJson.main = 'index.js';
packageJson.types = 'index.d.td';

fs.writeFileSync(`${distDir}/package.json`, JSON.stringify(packageJson, null, 2));
fs.copyFileSync(`${rootDir}/README.md`, `${distDir}/README.md`);
