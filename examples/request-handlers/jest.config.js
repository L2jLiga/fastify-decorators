const baseConfig = require('../../jest.examples.config');

module.exports = {
  ...baseConfig,
  coverageDirectory: './coverage/integration/request-handlers',
  testRegex: 'examples/request-handlers/test/.*.test.ts$',
};
