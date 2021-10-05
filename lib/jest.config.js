/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

export default {
  preset: 'ts-jest/presets/default-esm',
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageDirectory: '../coverage/library',
  coverageReporters: ['lcov', 'text'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.spec.json',
      compilerHost: true,
      useESM: true,
    },
  },
  collectCoverageFrom: ['**/*.ts', '!plugins/*.ts', '!**/*.mock.ts', '!**/*.test.ts', '!**/*.spec.ts', '!**/.rollup.cache/**'],
};
