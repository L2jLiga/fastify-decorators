module.exports = () => ({
    files: [
        'lib/jest.config.js',
        'lib/tsconfig.json',
        'lib/tsconfig.spec.json',
        'lib/**/*.ts',
        '!lib/**/*.spec.ts'
    ],
    tests: [
        'lib/**/*.spec.ts'
    ],

    env: {
        type: 'node'
    },
    testFramework: 'jest',

    setup(wallaby) {
        wallaby.testFramework.configure(require('./lib/jest.config.js'));
    }
});
