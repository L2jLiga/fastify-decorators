const baseConfig = require('../../jest.examples.config');

module.exports = {
  ...baseConfig,
  coverageDirectory: './coverage/examples/swagger',
  testRegex: 'examples/swagger/test/.*.test.ts$',
}
