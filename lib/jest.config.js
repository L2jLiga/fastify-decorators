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
  coverageDirectory: '../coverage/library',
  coverageReporters: ['lcov', 'text'],
  coverageProvider: 'v8',

  reporters: ['default', ['jest-junit', { outputDirectory: '../test-results' }]],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
        useESM: true,
      },
    ],
  },
  collectCoverageFrom: ['**/*.ts', '!plugins/*.ts', '!**/*.mock.ts', '!**/*.test.ts', '!**/*.spec.ts', '!**/.rollup.cache/**'],
};
