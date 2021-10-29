import baseConfig from '../../jest.examples.config.js';

export default {
  ...baseConfig,
  coverageDirectory: './coverage/integration/request-handlers',
  testRegex: 'examples/request-handlers/test/.*.test.ts$',
};
