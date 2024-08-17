import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslint from '@eslint/js';
import jestPlugin from 'eslint-plugin-jest';
import tseslint from 'typescript-eslint';
import tsdocPlugin from 'eslint-plugin-tsdoc';

export default [
  {
    // config with just ignores is the replacement for `.eslintignore`
    ignores: ['**/build/**', '**/dist/**', 'src/some/file/to/ignore.ts'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
    rules: {
      'max-len': [
        'error',
        160,
        2,
        {
          ignoreUrls: true,
          ignoreComments: true,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'comma-dangle': ['error', 'always-multiline'],
    },
  },
  {
    files: ['**/*.ts'],
    plugins: {
      tsdoc: tsdocPlugin,
    },
    rules: { 'tsdoc/syntax': 'error' },
  },
  {
    // disable type-aware linting on JS files
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  {
    // enable jest rules on test files
    files: ['**/*.spec.ts', '**/*.mock.ts'],
    ...jestPlugin.configs['flat/recommended'],
  },
  eslintPluginPrettierRecommended,
];
