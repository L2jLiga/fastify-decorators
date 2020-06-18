# Fastify decorators
[![npm version](https://badge.fury.io/js/fastify-decorators.svg?colorB=brightgreen)](https://www.npmjs.com/package/fastify-decorators)
[![npm](https://img.shields.io/npm/dm/fastify-decorators.svg?colorB=brightgreen)](https://www.npmjs.com/package/fastify-decorators)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

[![codecov](https://codecov.io/gh/L2jLiga/fastify-decorators/branch/next/graph/badge.svg)](https://codecov.io/gh/L2jLiga/fastify-decorators)

Fastify-decorators is the set of decorators to easier development of Fastify application.

This package based on Fastify `^2.0.0` and may not work with other versions.

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
- [src] directory contains example of usage of this library
- [test] directory contains tests for library and example

**NOTE**: give a look also to the [`package.json`] to find out how the scripts are done 😉

## How to run example

1. clone this repository or download
1. open terminal in project directory
1. type `npm install`
1. type `npm run build`
1. type `npm start`

Example will be available on http://localhost:3000. You can check it by GET request to http://localhost:3000/get

## License

This project licensed under [MIT License]

[library README]: ./lib/README.md
[JetBrains IDE plugin]: https://plugins.jetbrains.com/plugin/13801-fastify-decorators
[lib]: ./lib
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
