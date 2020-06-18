# Fastify decorators

This package developed to provide useful typescript decorators to implement RequestHandler pattern with [Fastify].

**NOTE**: Fastify-decorators was developed with fastify `^2.0.0` and may not work with other versions.

## Install

via npm:
```
npm install fastify-decorators --save
```

via yarn:
```
yarn add fastify-decorators
```

## IDE support

- [JetBrains IDE plugin]

## Documentation

- [Getting Started]
- [Request Handler]
- [Controllers]
- [Dependency Injection]
- [Testing]
- [Migration guide (V3)]

## Basic usage

### Controller

*src/sample.controller.ts*:
```typescript
import { Controller, GET } from 'fastify-decorators';

@Controller('/sample')
export default class SampleController {
    @GET('/')
    async handle() {
        return 'It works!';
    }
}
```

### Request Handler

*src/sample.handler.ts*:
```typescript
import { GET, RequestHandler } from 'fastify-decorators';

@GET('/sample')
export default class SampleHandler extends RequestHandler {
    async handle() {
        return 'It works!';
    }
}
```

### Bootstrapping

*index.ts*:
```typescript
import { bootstrap } from 'fastify-decorators';
import fastify = require('fastify');
import { resolve } from 'path';

// Create Fastify instance
const instance = fastify();

// Register handlers auto-bootstrap
instance.register(bootstrap, {
    directory: resolve(__dirname, `src`),
    mask: /\.(controller|handler)\./
});

instance.listen(3000);
```

**NOTE**: Using decorators require `experimentalDecorators` to be enabled in `tsconfig.json`

## API

### bootstrap

`bootstrap` is Fastify plugin to autoload all decorated modules

*example*:
```typescript
import fastify = require('fastify');
import {bootstrap} from 'fastify-decorators';

const instance = fastify();

instance.register(bootstrap, options)
```

#### Bootstrap options

| name              | type               | required | description                                              |
|-------------------|--------------------|:--------:|----------------------------------------------------------|
| directory         | `string`           | yes      | Specify directory where controllers/handlers are located |
| mask              | `string`, `RegExp` | no       | Specify mask for files filter                            |
| prefix            | `string`           | no       | Specify prefix for routes                                |

### Decorators

List of available decorators for handlers:
- `GET`
- `POST`
- `PUT`
- `DELETE`
- `HEAD`
- `OPTIONS`
- `ALL`

*example*:
```typescript
import { POST, RequestHandler } from 'fastify-decorators';

@POST(options)
export default class SimpleHandler extends RequestHandler {
    async handle() {return ''}
}
```

Also fastify-decorators provides decorator for Controllers implementation:

- `Controller` decorator uses on class
- `hook` decorator to uses on methods to define [Fastify Hook]
- Same decorators as for handlers use on methods to define [Fastify Route]

#### Controller decorator options:
Controller accepts `string` as route parameter.
It also possible to passthroughs configuration object in case if complex configuration needed:

| name  | type                  | required | description                                      |
|-------|-----------------------|:--------:|--------------------------------------------------|
| route | string                | yes      | Controller base route                            |
| type  | `ControllerType` enum | no       | Define controller behaviour. Default `SINGLETON` |

#### Hook decorator options:
| name  | type   | required | description           |
|-------|--------|:--------:|-----------------------|
| name  | string | yes      | Hook name             |

#### Handler decorators options (for controllers and handlers both)
Handler decorators accept `srting` as URL parameter.
It also possible to passthroughs configuration object in case if complex configuration needed:

| name    | type            | required | description                                      |
|---------|-----------------|:--------:|--------------------------------------------------|
| url     | `string`        | yes      | Route url which will be passed to Fastify        |
| options | [`RouteConfig`] | no       | Config for route which will be passed to Fastify |

## License

This project licensed under [MIT License]

[Fastify]: https://npmjs.org/package/fastify
[JetBrains IDE plugin]: https://plugins.jetbrains.com/plugin/13801-fastify-decorators
[MIT License]: https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
[`RouteConfig`]: https://github.com/fastify/fastify/blob/master/docs/Routes.md
[Fastify Hook]: https://github.com/fastify/fastify/blob/master/docs/Hooks.md
[Fastify Route]: https://github.com/fastify/fastify/blob/master/docs/Routes.md

[Getting Started]: ./docs/Getting-Started.md
[Request Handler]: ./docs/Request-Handlers.md
[Controllers]: ./docs/Controllers.md
[Dependency Injection]: ./docs/Dependency-Injection.md
[Testing]: ./docs/Testing.md
[Migration guide (V3)]: ./lib/docs/Migration-to-v3.md
