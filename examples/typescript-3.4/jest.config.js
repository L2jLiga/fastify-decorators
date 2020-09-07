module.exports = {
  preset: 'ts-jest',
  testEnvironment: '../../jest.environment.js',
  collectCoverage: true,
  coverageReporters: ['text'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
  testRegex: 'test/.*.test.ts$',
}
