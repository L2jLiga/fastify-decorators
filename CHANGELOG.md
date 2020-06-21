# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
## [3.0.0-0]
## Added
- `@ErrorHandler` decorator for error handling within controllers

## Changed
- *BREAKING*: move to Fastify 3

## [2.0.0]
### Added
- Dependency injection
- APIs and documentation for testing
- New bootstrap options
   - `directory`, `mask` - common replacement for old bootsrap options
   - `controllers` - used to specify list of controllers to bootstrap
- Overloads to controller and requests handlers, now they can accept string instead of configuration object
- Controller can accept configuration in two different ways
   - As a single object describing controller configuration
   - As a string with route
- Request handlers can accept configuration in three different ways
   - As a single object describing controller configuration
   - As a string with route
   - As a string with route and route options
- Plugin for JetBrains IDE (WebStorm, IDEA, ...)
- Option to skip broken modules from attempts to bootstrap

### Changed
- **BREAKING CHANGE**: symbols not exported anymore
- **BREAKING CHANGE**: minimal supported version of node is 10.14
- Throw human-friendly error when errors happened due initialization
- Specify module type in package.json

### Fixed
- Correctly handle all arguments passed to handler (#9)
- Incorrect links in the README.md when publish on NPM
- Typos in documentation

### Removed
- `controllersDirectory`, `controllersMask`, `handlersDirectory` and `handlersMask` bootstrap options
- `AbstractController` in favor of Dependency Injection
- hooks initialization in `REQUESTS` controller type

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

[Unreleased]: https://github.com/L2jLiga/fastify-decorators/compare/v3.0.0-0...HEAD
[3.0.0-0]: https://github.com/L2jLiga/fastify-decorators/compare/v2.0.0...v3.0.0-0
[2.0.0]: https://github.com/L2jLiga/fastify-decorators/compare/v1.3.0...v2.0.0
[1.3.0]: https://github.com/L2jLiga/fastify-decorators/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/L2jLiga/fastify-decorators/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/L2jLiga/fastify-decorators/compare/v1.0.0...v1.1.0
