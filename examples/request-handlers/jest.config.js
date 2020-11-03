const baseConfig = require('../../jest.examples.config');

module.exports = {
  ...baseConfig,
  coverageDirectory: './coverage/examples/request-handlers',
  testRegex: 'examples/request-handlers/test/.*.test.ts$',
};
