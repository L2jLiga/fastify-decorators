import baseConfig from '../../jest.examples.config.js';

export default {
  ...baseConfig,
  coverageDirectory: './coverage/integration/injecting-requests-in-services',
  testRegex: 'examples/injecting-requests-in-services/test/.*.test.ts$',
};
