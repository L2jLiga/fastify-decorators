const baseConfig = require('../../jest.examples.config');

module.exports = {
  ...baseConfig,
  coverageDirectory: './coverage/integration/swagger',
  testRegex: 'examples/swagger/test/.*.test.ts$',
};
