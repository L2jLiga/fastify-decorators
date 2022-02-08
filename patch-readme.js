/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';

/* __dirname polyfill */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* paths to all required files */
const packageDist = path.join(__dirname, 'dist', 'fastify-decorators');
const packageJsonPath = path.join(packageDist, 'package.json');
const readmePath = path.join(packageDist, 'README.md');

/* urls for patches */
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const baseUrl = `https://github.com/L2jLiga/fastify-decorators/blob/v${packageJson.version}/`;
const rawUrl = `https://raw.githubusercontent.com/L2jLiga/fastify-decorators/v${packageJson.version}/`;

/* patching */
const content = fs
  .readFileSync(readmePath, 'utf8')
  .replace(/]: (\.\/.+)/g, (match, file) => `]: ${baseUrl}${makeUrl(baseUrl, file)}`)
  .replace(/(!\[.+])\((\.\/[a-zA-Z/\\.-_0-9]+)\)/g, (match, imageName, imageFile) => `${imageName}(${makeUrl(rawUrl, imageFile)})`);
fs.writeFileSync(readmePath, content, 'utf8');

/* helpers */
function makeUrl(uri, filepath) {
  const url = new URL(uri);
  url.href += filepath;
  return url.href;
}
