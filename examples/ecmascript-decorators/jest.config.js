import baseConfig from '../../jest.examples.config.js';

export default {
  ...baseConfig,
  coverageDirectory: './coverage/integration/ecmascript-decorators',
  testRegex: 'examples/ecmascript-decorators/test/.*.test.ts$',
};
