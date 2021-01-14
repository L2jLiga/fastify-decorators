const baseConfig = require('../../jest.examples.config');

module.exports = {
  ...baseConfig,
  coverageDirectory: './coverage/integration/typeorm',
  testRegex: 'examples/typeorm/test/.*.test.ts$',
};
