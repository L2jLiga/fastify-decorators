const baseConfig = require('../../jest.examples.config');

module.exports = {
  ...baseConfig,
  collectCoverage: false,
  testRegex: 'plugins/simple-di/test/.*.spec.ts$',
};
