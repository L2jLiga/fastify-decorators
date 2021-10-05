import baseConfig from '../../jest.examples.config.js';

export default {
  ...baseConfig,
  coverageDirectory: './coverage/integration/aws-lambda',
  testRegex: 'examples/aws-lambda/test/.*.test.ts$',
};
