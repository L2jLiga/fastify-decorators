import glob from 'glob';

// Jest issue: https://github.com/facebook/jest/issues/11438
// Workaround for dynamic import + ESM
// Each test file should have separated worker
// So we have to count amount of files with tests per project

const nodeVersionRegex = /(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)/;
const { major, minor } = nodeVersionRegex.exec(process.version).groups;

const isIssueAffectCurrentVersion = Number.parseInt(major) * 100 + Number.parseInt(minor) < 1611;

const testsCount = glob.sync('{src,test}/**/*.{spec,test}.ts').length;

export const workersWorkaround = isIssueAffectCurrentVersion
  ? {
      maxConcurrency: testsCount,
      maxWorkers: testsCount,
    }
  : {};
