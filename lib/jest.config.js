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
  collectCoverageFrom: ['**/*.ts', '!interfaces/*.ts', '!plugins/*.ts', '!**/*.mock.ts', '!**/*.test.ts', '!**/*.spec.ts', '!**/.rollup.cache/**'],
};
