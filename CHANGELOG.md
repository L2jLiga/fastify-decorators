# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
## Added
- User friendly error when trying to bootstrap invalid module
- Option to skip broken modules to prevent crash when trying to bootstrap invalid module

## [2.0.0-5]
## Added
- Link to JetBrains IDE plugin (WebStorm, IDEA, ...)

### Changed
- Bump minimal node.js version to 10.14

## Removed
- Deprecated bootstrap options

## [2.0.0-4]
## Fixed
- `getInstanceByToken` returns wrapped instance

## [2.0.0-3]
## Changed
- Removed hooks initialization in `REQUESTS` controller type

## [2.0.0-2]
## Added
- New overload for method decorators, now you can pass url and options as separated arguments

## [2.0.0-1]
## Fixed
- Use spread operator when call handlers (#9)
- Incorrect links in README.md when publish on NPM

## [2.0.0-0]
## Added
- `directory` and `mask` bootstrap options
- Overloads to controller and requests handlers, now they can accept string instead of configuration object
- Dependency injection

## Changed
- **BREAKING CHANGE**: symbols not exported anymore
- **BREAKING CHANGE**: minimal supported version of node is 10
- Deprecated `controllersDirectory`, `controllersMask`, `handlersDirectory` and `handlersMask` bootstrap options
- Deprecated `AbstractController` in favor of Dependency Injection
- Corrected signatures of decorators
- Corrected several typos in documentation
- Module system specified in package.json

## [1.3.0]
### Added
- Ability to load modules when default export used

## [1.2.0]
### Added
- Option to make available Fastify instance inside controller

### Fixed
- Controller instance was created once for each Hook instead of every request

## [1.1.0]
### Added
- `@Controller` and `@Hook` decorators

### Changed
- Improvements in documentation

## 1.0.0
- Initial release

[Unreleased]: https://github.com/L2jLiga/fastify-decorators/compare/v2.0.0-5...HEAD
[2.0.0-5]: https://github.com/L2jLiga/fastify-decorators/compare/v2.0.0-4...v2.0.0-5
[2.0.0-4]: https://github.com/L2jLiga/fastify-decorators/compare/v2.0.0-3...v2.0.0-4
[2.0.0-3]: https://github.com/L2jLiga/fastify-decorators/compare/v2.0.0-2...v2.0.0-3
[2.0.0-2]: https://github.com/L2jLiga/fastify-decorators/compare/v2.0.0-1...v2.0.0-2
[2.0.0-1]: https://github.com/L2jLiga/fastify-decorators/compare/v2.0.0-0...v2.0.0-1
[2.0.0-0]: https://github.com/L2jLiga/fastify-decorators/compare/v1.3.0...v2.0.0-0
[1.3.0]: https://github.com/L2jLiga/fastify-decorators/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/L2jLiga/fastify-decorators/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/L2jLiga/fastify-decorators/compare/v1.0.0...v1.1.0
