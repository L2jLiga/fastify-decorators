# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
