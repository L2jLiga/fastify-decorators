# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 3.2.1
### Fixed
- Request handlers decorators (GET, POST, PUT etc) ignore second argument:
   ```typescript
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
- *BREAKING*: move to Fastify 3

### Fixed
- `package.json` was missed in `fastify-decorators/testing`
