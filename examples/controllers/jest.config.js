const baseConfig = require('../../jest.examples.config');

module.exports = {
  ...baseConfig,
  coverageDirectory: './coverage/examples/controllers',
  testRegex: 'examples/controllers/test/.*.test.ts$',
};
