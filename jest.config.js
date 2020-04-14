/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

module.exports = {
    preset: 'ts-jest',
    testEnvironment: './jest.environment.js',
    collectCoverage: true,
    coverageReporters: ['text'],
    collectCoverageFrom: [
        'src/**/*.ts',
    ],
    globals: {
        'ts-jest': {
            tsConfig: './tsconfig.json',
        },
    },
    modulePathIgnorePatterns: [
        '<rootDir>/dist',
        '<rootDir>/node_modules/fastify-decorators',
    ],
    testRegex: 'test/.*\.spec\.ts$',
};
