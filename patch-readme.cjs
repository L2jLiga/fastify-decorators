const fs = require('fs');
const path = require('path').posix;

const packageJson = require('./dist/fastify-decorators/package');
const baseUrl = `https://github.com/L2jLiga/fastify-decorators/blob/v${packageJson.version}/`;

const readme = path.join('dist', packageJson.name, 'README.md');
const encoding = 'utf-8';
const content = fs.readFileSync(readme, encoding);
const newContent = content.replace(/]: (.\/.+)/g, (match, file) => `]: ${baseUrl}${path.relative(__dirname, path.join(__dirname, 'lib', file))}`);
fs.writeFileSync(readme, newContent, encoding);
