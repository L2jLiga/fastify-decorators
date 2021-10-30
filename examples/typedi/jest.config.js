import baseConfig from '../../jest.examples.config.js';

export default {
  ...baseConfig,
  coverageDirectory: './coverage/integration/typedi',
  testRegex: 'examples/typedi/test/.*.test.ts$',
};
