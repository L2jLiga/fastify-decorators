const baseConfig = require('../../jest.examples.config');

module.exports = {
  ...baseConfig,
  coverageDirectory: './coverage/examples/typescript-3.4',
  testRegex: 'examples/typescript-3.4/test/.*.test.ts$',
};
