import baseConfig from '../../jest.examples.config.js';

export default {
  ...baseConfig,
  coverageDirectory: './coverage/integration/typeorm',
  testRegex: 'examples/typeorm/test/.*.test.ts$',
};
