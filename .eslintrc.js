/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
  plugins: ['@typescript-eslint', 'jest'],
  extends: ['eslint:recommended', 'plugin:jest/recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  rules: {
    '@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }],
    semi: 'off',
    '@typescript-eslint/semi': ['error'],
    'max-len': ['error', 160, 2, { ignoreUrls: true, ignoreComments: true, ignoreRegExpLiterals: true, ignoreStrings: true, ignoreTemplateLiterals: true }],
    'jest/expect-expect': 'off',
  },
};
