import baseConfig from '../../jest.examples.config.js';

export default {
  ...baseConfig,
  coverageDirectory: './coverage/integration/swagger',
  testRegex: 'examples/swagger/test/.*.test.ts$',
};
