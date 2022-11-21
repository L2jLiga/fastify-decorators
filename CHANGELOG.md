# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 3.15.0

### Added

- Injectables holder object in order to provide own classes/singletons at startup (issue [#835](https://github.com/L2jLiga/fastify-decorators/issues/835))

### Fixed

- Initializer was called multiple times (issue [#834](https://github.com/L2jLiga/fastify-decorators/issues/834))
- Proxy mess up objects which are not services (issue [#834 (comment)](https://github.com/L2jLiga/fastify-decorators/issues/834#issuecomment-1319039007))
- Service destructor is called when service is imported but not initialized (issue [#786](https://github.com/L2jLiga/fastify-decorators/issues/786))

## 3.14.1

### Fixed

- Do not mutate parent controller methods in case of inheritance

## 3.14.0

### Added

- FastifyRequest and FastifyReply injection option (backport #555)
- Option to use custom FastifyInstance in controller/service tests (#801)

### Fixed

- Undefined when extending from abstract class (#802)

## 3.13.1

### Fixed

- Tags from controller not applied to routes when handler has schema object

## 3.13.0

### Added

- new option `classLoader`, allows to implement own DI logic instead of fastify-decorators provides. See [Using custom class loader](./docs/Bootstrapping.md#using-custom-class-loader) for more details.
- new Controllers option `tags`, allows to specify set of tags for all methods in controller, useful for grouping methods in swagger

## 3.12.0

### Added

- Fastify v4 support

### Fixed

- Unable to use `@Inject` when `useDefineForClassFields` enabled in tsconfig (#750)
- `@Inject` does not work when `reflect-metadata` not present (#752)

### Removed

- Experimental plugin APIs

## 3.11.0

### Changed

- Bootstrap autoload config now accepts `PathLike` instead of just string. This is useful for ESM projects by simplifying code:

  _before_:

  ```typescript
  import 'reflect-metadata';
  import { fastify } from 'fastify';
  import { bootstrap } from 'fastify-decorators';
  import * as path from 'path';
  import { fileURLToPath } from 'url';

  export const app = fastify();

  app.register(bootstrap, {
    directory: path.dirname(fileURLToPath(import.meta.url)),
  });
  ```

  _after_:

  ```typescript
  import 'reflect-metadata';
  import { fastify } from 'fastify';
  import { bootstrap } from 'fastify-decorators';

  export const app = fastify();

  app.register(bootstrap, {
    directory: import.meta.url,
  });
  ```

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
