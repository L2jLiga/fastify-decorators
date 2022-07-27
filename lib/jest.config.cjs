/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

module.exports = {
  preset: 'ts-jest',
  resolver: 'jest-ts-webcompat-resolver',
  testEnvironment: './jest.environment.cjs',
  collectCoverage: true,
  coverageDirectory: '../coverage/library',
  coverageReporters: process.env.CI ? ['text', 'lcov'] : ['text'],
  reporters: process.env.CI ? ['default', 'jest-github-actions-reporter'] : ['default'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.spec.json',
      compilerHost: true,
    },
  },
  collectCoverageFrom: ['**/*.ts', '!**/*.mock.ts', '!**/*.test.ts', '!**/*.spec.ts', '!**/.rollup.cache/**'],
};
