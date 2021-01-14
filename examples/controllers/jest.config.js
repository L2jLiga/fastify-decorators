const baseConfig = require('../../jest.examples.config');

module.exports = {
  ...baseConfig,
  coverageDirectory: './coverage/integration/controllers',
  testRegex: 'examples/controllers/test/.*.test.ts$',
};
