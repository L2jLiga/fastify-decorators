const Run = require('@lerna/run');

new Run({
  script: process.argv[process.argv.length - 1],
  ignore: ['@fastify-decorators-examples/esm'],
  lernaVersion: '4.0.0',
});
