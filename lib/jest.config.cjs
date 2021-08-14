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
  collectCoverage: true,
  coverageDirectory: '../coverage/library',
  coverageReporters: process.env.CI ? ['text', 'lcov', 'jest-github-actions-reporter'] : ['text'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.spec.json',
      compilerHost: true,
    },
  },
  collectCoverageFrom: ['**/*.ts', '!plugins/*.ts', '!**/*.mock.ts', '!**/*.test.ts', '!**/*.spec.ts', '!**/.rollup.cache/**'],
};
