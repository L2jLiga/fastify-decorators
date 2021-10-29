import baseConfig from '../../jest.examples.config.js';

export default {
  ...baseConfig,
  coverageDirectory: './coverage/integration/controllers',
  testRegex: 'examples/controllers/test/.*.test.ts$',
};
