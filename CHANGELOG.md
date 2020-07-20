# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
## 3.1.0
### Added
- More strict check for `@Controller` decorator

### Fixed
- Possible call stack size exceeded when using autobootstrap

## 3.0.0
### Added
- `@ErrorHandler` decorator for error handling within controllers

### Changed
- *BREAKING*: move to Fastify 3

### Fixed
- `package.json` was missed in `fastify-decorators/testing`

[Unreleased]: https://github.com/L2jLiga/fastify-decorators/compare/v3.0.0...HEAD
