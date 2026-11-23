const baseConfig = require('../../jest.examples.config');

module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    '^fastify-decorators$': '<rootDir>/dist/fastify-decorators/index.cjs',
    '^fastify-decorators/testing$': '<rootDir>/dist/fastify-decorators/Testing/index.cjs',
  },
  collectCoverage: false,
  coverageDirectory: './coverage/integration/controllers',
  testRegex: 'examples/fastify-v5/test/.*\\.test\\.ts$',
};
