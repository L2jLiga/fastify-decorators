const baseConfig = require('../../jest.examples.config');

module.exports = {
  ...baseConfig,
  coverageDirectory: './coverage/examples/error-handlers',
  testRegex: 'examples/error-handlers/test/.*.test.ts$',
}
