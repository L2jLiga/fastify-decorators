const fs = require('fs');
const path = require('path');

const packageJson = require('./dist/fastify-decorators/package');

const readme = path.join('dist', packageJson.name, 'README.md');
const encoding = 'utf-8';
const content = fs.readFileSync(readme, encoding);
const newContent = content.replace(new RegExp(']: ./', 'g'), `]: https://github.com/L2jLiga/fastify-decorators/blob/v${packageJson.version}/lib/`);
fs.writeFileSync(readme, newContent, encoding);
