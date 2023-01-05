import baseConfig from '../../jest.examples.config.js';

export default {
  ...baseConfig,
  coverageDirectory: './coverage/integration/async-initializer',
  testRegex: 'examples/async-initializer/test/.*.test.ts$',
};
