const baseConfig = require('../../jest.examples.config');

module.exports = {
  ...baseConfig,
  collectCoverage: false,
  testRegex: 'plugins/typeorm/test/.*.spec.ts$',
};
