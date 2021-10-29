import { workersWorkaround } from './jest-dynamic-import-esm-workaround.js';

export default {
  preset: 'ts-jest/presets/default-esm',
  rootDir: '../..',
  collectCoverage: true,
  coverageReporters: ['lcov', 'text'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.spec.json',
      useESM: true,
    },
  },
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverageFrom: ['lib/**/*.ts', '!lib/plugins/*.ts', '!lib/**/*.mock.ts', '!lib/**/*.test.ts', '!lib/**/*.spec.ts', '!**/.rollup.cache/**'],
  moduleNameMapper: {
    '^fastify-decorators$': '<rootDir>/lib/index.ts',
    '^fastify-decorators/(.*)$': '<rootDir>/lib/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/fastify-decorators', '<rootDir>/node_modules/fastify-decorators'],
  ...workersWorkaround,
};
