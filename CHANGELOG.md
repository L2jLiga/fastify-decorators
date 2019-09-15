# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## next
## Added
- `directory` and `mask` bootstrap options

## Changed
- **BREAKING CHANGE**: symbols not exported anymore
- Deprecated `controllersDirectory`, `controllersMask`, `handlersDirectory` and `handlersMask` bootstrap options

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

[1.2.0]: https://github.com/L2jLiga/fastify-decorators/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/L2jLiga/fastify-decorators/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/L2jLiga/fastify-decorators/compare/v1.0.0...v1.1.0
