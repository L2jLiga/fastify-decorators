# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 4.0.0

### Added

- Initialization hooks for plugin ecosystem
- Option to inject Request/Reply into services
- Support for URL in autoload config
- Plugin for integration with [TypeDI](https://npmjs.com/package/typedi)

### Changed

- BREAKING: dropped Node.js 10 and 12, minimal required is 14 LTS
- BREAKING: moved dependency injection functionality into separate package
- BREAKING: removed CommonJS build
- BREAKING: minimal TypeScript version officially supported is 4.0

## 3.10.0

### Added

- Option to specify global prefix

## 3.9.1

### Fixed

- Logo is not visible on npmjs

## 3.9.0

### Added

- Experimental plugins APIs
- `repository.directory` field to `package.json`

### Changed

- Inline CJS source maps
- Provide TypeScript 3.4 compatible typings by default
- Documentation minor updates

## 3.8.0

### Added

- `@Destructor` decorator for services graceful shutdown

## 3.7.1

### Fixed

- Missed CJS files for `fastify-decorators/testing` (#113)

## 3.7.0

### Added

- Added option to specify plugins when configuring controllers/services tests
- Publish library as dual package (ES Modules + CommonJS)

## 3.6.0

### Added

- `FastifyInstanceWithController` interface for testing (#93)

## 3.5.0

### Added

- `configureControllerTest` decorate `FastifyInstance` with controller property

### Changed

- Huge documentation rework

## 3.4.1

### Fixed

- FastifyInstance not available for injection in tests

## 3.4.0

### Added

- Hooks and error handlers support for stateless controllers (ControllerType.REQUEST)
- Support for async services testing

### Fixed

- Hooks override in RequestHandler when hook with same name defined multiple times
- Invalid RequestHandler constructor call when it has hooks
- RequestHandler / Controller options mutation
- Bootstrap failure when async services injected with `@Inject`

## 3.3.1

### Fixed

- Warning when install due to unsatisfied peer dependency - `fastify-plugin`

## 3.3.0

### Added

- support for services that need an async setup ([#58](https://github.com/L2jLiga/fastify-decorators/issues/58))

## 3.2.4

### Fixed

- Bootstrap controllers properly
- Remove a global flag from mask if presents

## 3.2.3

### Changed

- Use `fastify-plugin` helper for `bootstrap`
- Use `import type` from TypeScript 3.8 (for TS < 3.8 users do `.d.ts` downlevel)

## 3.2.2

### Fixed

- Avoid redundant wrapping when configuring mocks for testing

## 3.2.1

### Fixed

- Request handlers decorators (GET, POST, PUT etc) ignore second argument:
  ```ts
  class Ctrl {
    @GET('/', { schema: { body: { type: 'string' } } }) // fastify options were ignored
    get() {}
  }
  ```

## 3.2.0

### Added

- `@ErrorHandler` support for request handlers
- `@Hook` support for request handlers

### Changed

- Do not register empty error handlers

## 3.1.1

### Fixed

- Cannot read property 'get' of undefined when using `configureControllerTest` on class with dependencies provided via `@Inject` decorator.

## 3.1.0

### Added

- More strict check for `@Controller` decorator

### Fixed

- Possible call stack size exceeded when using autobootstrap

## 3.0.0

### Added

- `@ErrorHandler` decorator for error handling within controllers

### Changed

- _BREAKING_: move to Fastify 3

### Fixed

- `package.json` was missed in `fastify-decorators/testing`
