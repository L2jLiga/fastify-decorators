const baseConfig = require('../../jest.examples.config');

module.exports = {
  ...baseConfig,
  coverageDirectory: './coverage/integration/async-initializer',
  testRegex: 'examples/async-initializer/test/.*.test.ts$',
};
