# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 4.0.0

### Added

- Experimental plugins APIs
- Plugin for integration with [TypeDI](https://npmjs.com/package/typedi)

### Changed

- BREAKING: dropped Node.js 10, 12 and 14, minimal required is 16.13.1 LTS
- BREAKING: dropped Fastify v3 support
- BREAKING: moved dependency injection functionality into separate package
- BREAKING: dropped `getInstanceByToken` method
- BREAKING: bump minimal TS version to 4.7

## 3.x.y

See [CHANGELOG.md at v3 branch](https://github.com/L2jLiga/fastify-decorators/blob/v3/CHANGELOG.md)
