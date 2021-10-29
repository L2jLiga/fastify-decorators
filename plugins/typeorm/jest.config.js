import baseConfig from '../../jest.examples.config.js';

export default {
  ...baseConfig,
  collectCoverage: false,
  testRegex: 'plugins/typeorm/test/.*.spec.ts$',
};
