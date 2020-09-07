# Fastify decorators
[![npm version](https://badge.fury.io/js/fastify-decorators.svg?colorB=brightgreen)](https://www.npmjs.com/package/fastify-decorators)
[![npm](https://img.shields.io/npm/dm/fastify-decorators.svg?colorB=brightgreen)](https://www.npmjs.com/package/fastify-decorators)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

![Node.js CI](https://github.com/L2jLiga/fastify-decorators/workflows/Node.js%20CI/badge.svg)
![Build example](https://github.com/L2jLiga/fastify-decorators/workflows/Build%20example/badge.svg)
[![codecov](https://codecov.io/gh/L2jLiga/fastify-decorators/branch/v3/graph/badge.svg)](https://codecov.io/gh/L2jLiga/fastify-decorators)

Fastify-decorators is the set of decorators to easier development of Fastify application.

This package based on Fastify 3 and may not work with other versions.

## Installation and usage

Installation and basic usage instruction can be found in [library README]

## IDE support

- [JetBrains IDE plugin]

## Documentation

- [Getting Started]
- [Request Handler]
- [Controllers]
- [Dependency Injection]
- [Testing]
- [Migration guide (V3)]

## Repository structure

- [lib] directory contains library sources
- [examples] directory contains sample projects
- [src] directory contains application used for testing
- [test] directory contains tests for library and example

**NOTE**: give a look also to the [`package.json`] to find out how the scripts are done 😉

## How to run example

1. clone or download this repository
1. install library dependencies by running `yarn install` or `npm install` in root directory
1. build library by running `yarn build` or `npm run build` in root directory
1. open terminal in [examples] directory
1. type `yarn install` or `npm install`
1. type `yarn build` or `npm run build`
1. type `yarn start` or `npm start`

Example will run and show url, routes and documentation (if available).

## License

This project licensed under [MIT License]

[library README]: ./lib/README.md
[JetBrains IDE plugin]: https://plugins.jetbrains.com/plugin/13801-fastify-decorators
[lib]: ./lib
[examples]: ./examples
[src]: ./src
[test]: ./test
[`package.json`]: ./package.json
[Getting Started]: ./lib/docs/Getting-Started.md
[Request Handler]: ./lib/docs/Request-Handlers.md
[Controllers]: ./lib/docs/Controllers.md
[Dependency Injection]: ./lib/docs/Dependency-Injection.md
[Testing]: ./lib/docs/Testing.md
[Migration guide (V3)]: ./lib/docs/Migration-to-v3.md
[MIT License]: https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
