const baseConfig = require('../../jest.examples.config');

module.exports = {
  ...baseConfig,
  coverageDirectory: './coverage/integration/injecting-requests-in-services',
  testRegex: 'examples/injecting-requests-in-services/test/.*.test.ts$',
};
