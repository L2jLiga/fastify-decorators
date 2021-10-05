import Run from '@lerna/run';

new Run({
  script: process.argv[process.argv.length - 1],
  lernaVersion: '4.0.0',
});
