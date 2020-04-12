/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

require('reflect-metadata');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: './jest.environment.js',
    collectCoverage: true,
    coverageDirectory: '../coverage',
    coverageReporters: ['text', 'lcov'],
    globals: {
        'ts-jest': {
            tsConfig: './lib/tsconfig.spec.json'
        }
    },
    collectCoverageFrom: [
        '**/*.ts',
        '!**/*.test.ts',
        '!**/*.spec.ts',
        '!**/*.mock.ts'
    ]
};
