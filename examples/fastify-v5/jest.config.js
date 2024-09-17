const baseConfig = require('../../jest.examples.config');

module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    '^fastify-decorators$': '<rootDir>/dist/fastify-decorators/index.cjs',
    '^fastify-decorators/testing$': '<rootDir>/dist/fastify-decorators/testing/index.cjs',
  },
  collectCoverage: false,
  coverageDirectory: './coverage/integration/controllers',
  testRegex: 'examples/controllers/test/.*.test.ts$',
};
