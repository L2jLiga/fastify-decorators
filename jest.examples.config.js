module.exports = {
  preset: 'ts-jest',
  rootDir: '../..',
  testEnvironment: './jest.environment.cjs',
  collectCoverage: true,
  coverageReporters: process.env.CI ? ['text', 'lcov', 'jest-github-actions-reporter'] : ['text'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.spec.json',
    },
  },
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverageFrom: ['lib/**/*.ts', '!lib/plugins/*.ts', '!lib/**/*.mock.ts', '!lib/**/*.test.ts', '!lib/**/*.spec.ts', '!**/.rollup.cache/**'],
  moduleNameMapper: {
    '^fastify-decorators$': '<rootDir>/lib/index.ts',
    '^fastify-decorators/(.*)$': '<rootDir>/lib/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/fastify-decorators', '<rootDir>/node_modules/fastify-decorators'],
};
