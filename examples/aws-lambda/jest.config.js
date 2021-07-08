const baseConfig = require('../../jest.examples.config');

module.exports = {
  ...baseConfig,
  coverageDirectory: './coverage/integration/aws-lambda',
  testRegex: 'examples/aws-lambda/test/.*.test.ts$',
};
