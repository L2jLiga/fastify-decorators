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
    coverageDirectory: './coverage/integration',
    coverageReporters: ['text', 'lcov'],
    collectCoverageFrom: [
        'lib/**/*.ts',
        '!lib/**/*.mock.ts',
        '!lib/**/*.spec.ts',
    ],
    globals: {
        'ts-jest': {
            tsConfig: './tsconfig.json',
        },
    },
    moduleNameMapper: {
        '^fastify-decorators$': '<rootDir>/lib/index.ts',
        '^fastify-decorators/(.*)$': '<rootDir>/lib/$1',
    },
    modulePathIgnorePatterns: [
        '<rootDir>/dist',
        '<rootDir>/node_modules/fastify-decorators',
    ],
    testRegex: 'test/.*.spec.ts$',
};
