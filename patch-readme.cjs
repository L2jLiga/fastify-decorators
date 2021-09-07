/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

const fs = require('fs');
const path = require('path').posix;

const packageJson = require('./dist/fastify-decorators/package');
const baseUrl = `https://github.com/L2jLiga/fastify-decorators/blob/v${packageJson.version}/`;
const rawUrl = `https://raw.githubusercontent.com/L2jLiga/fastify-decorators/v${packageJson.version}/`;

const readme = path.join(__dirname, 'dist', packageJson.name, 'README.md');
const encoding = 'utf-8';
const content = fs.readFileSync(readme, encoding);
const newContent = content
  .replace(/]: (\.\/.+)/g, (match, file) => `]: ${baseUrl}${path.relative(__dirname, path.join(__dirname, file))}`)
  .replace(
    /(!\[.+])\((\.\/[a-zA-Z/\\.-_0-9]+)\)/g,
    (match, imageName, imageFile) => `${imageName}(${rawUrl}${path.relative(__dirname, path.join(__dirname, imageFile))})`,
  );
fs.writeFileSync(readme, newContent, encoding);
