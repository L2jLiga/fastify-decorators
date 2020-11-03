const baseConfig = require('../../jest.examples.config');

module.exports = {
  ...baseConfig,
  coverageDirectory: './coverage/examples/typeorm',
  testRegex: 'examples/typeorm/test/.*.test.ts$',
};
