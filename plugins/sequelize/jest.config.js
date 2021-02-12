const baseConfig = require('../../jest.examples.config');

module.exports = {
  ...baseConfig,
  collectCoverage: false,
  testRegex: 'plugins/sequelize/test/.*.spec.ts$',
};
