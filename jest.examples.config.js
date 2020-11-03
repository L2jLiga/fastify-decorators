module.exports = {
  preset: 'ts-jest',
  rootDir: '../..',
  testEnvironment: './jest.environment.js',
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.spec.json',
    },
  },
  collectCoverageFrom: [
    'lib/**/*.ts',
    '!lib/**/*.mock.ts',
    '!lib/**/*.test.ts',
    '!lib/**/*.spec.ts',
  ],
  moduleNameMapper: {
    '^fastify-decorators$': '<rootDir>/lib/index.ts',
    '^fastify-decorators/(.*)$': '<rootDir>/lib/$1',
  },
  modulePathIgnorePatterns: [
    '<rootDir>/dist/fastify-decorators',
    '<rootDir>/node_modules/fastify-decorators',
  ],
};
