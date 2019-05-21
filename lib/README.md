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

## Basic usage

### Request Handler

*index.ts*:
```typescript
import { bootstrap } from 'fastify-decorators';
import fastify = require('fastify');
import { join } from 'path';

// Create Fastify instance
const instance = fastify();

// Register handlers auto-bootstrap
instance.register(bootstrap, {
    handlersDirectory: join(__dirname, `handlers`),
    handlersMask: /\.handler\./
});

instance.listen(3000);
```


*handlers/sample.handler.ts*:
```typescript
import { GET, RequestHandler } from 'fastify-decorators';

@GET({
    url: '/sample'
})
class SampleHandler extends RequestHandler {
    async handle() {
        return 'It works!';
    }
}

// We should export class to make it accessible to bootstraper
export = SampleHandler;
```

### Controller

*index.ts*:
```typescript
import { bootstrap } from 'fastify-decorators';
import fastify = require('fastify');
import { join } from 'path';

// Create Fastify instance
const instance = fastify();

// Register handlers auto-bootstrap
instance.register(bootstrap, {
    controllersDirectory: join(__dirname, `controllers`),
    controllersMask: /\.controller\./
});

instance.listen(3000);
```


*handlers/sample.controller.ts*:
```typescript
import { Controller, GET } from 'fastify-decorators';

@Controller({
    route: '/sample'
})
class SampleController {
    @GET({url: '/'})
    async handle() {
        return 'It works!';
    }
}

// We should export class to make it accessible to bootstraper
export = SampleController;
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

| name              | type               | required | description                                  |
|-------------------|--------------------|:--------:|----------------------------------------------|
| handlersDirectory | `string`           | yes      | Specify directory where handlers are located |
| handlersMask      | `string`, `RegExp` | no       | Specify mask for files filter                |
| prefix            | `string`           | no       | Specify prefix for routes                    |

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
class SimpleHandler extends RequestHandler {
    async handle() {return ''}
}

export = SimpleHandler;
```

Also fastify-decorators provides decorator for Controllers implementation:

- `Controller` decorator uses on class
- `hook` decorator to uses on methods to define [Fastify Hook]
- Same decorators as for handlers use on methods to define [Fastify Route]

#### Controller decorator options:
| name  | type                  | required | description                                      |
|-------|-----------------------|:--------:|--------------------------------------------------|
| route | string                | yes      | Controller base route                            |
| type  | `ControllerType` enum | no       | Define controller behaviour. Default `SINGLETON` |

#### Hook decorator options:
| name  | type   | required | description           |
|-------|--------|:--------:|-----------------------|
| name  | string | yes      | Hook name             |

#### Handler decorators options (for controllers and handlers both)
| name    | type            | required | description                                      |
|---------|-----------------|:--------:|--------------------------------------------------|
| url     | `string`        | yes      | Route url which will be passed to Fastify        |
| options | [`RouteConfig`] | no       | Config for route which will be passed to Fastify |

## Documentation

- [Getting Started]
- [Request Handler]

## License

This project licensed under [MIT License]

[Fastify]: https://npmjs.org/package/fastify
[MIT License]: https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
[`RouteConfig`]: https://github.com/fastify/fastify/blob/master/docs/Routes.md
[Fastify Hook]: https://github.com/fastify/fastify/blob/master/docs/Hooks.md
[Fastify Route]: https://github.com/fastify/fastify/blob/master/docs/Routes.md

[Getting Started]: https://github.com/L2jLiga/fastify-decorators/blob/master/docs/Getting-Started.md
[Request Handler]: https://github.com/L2jLiga/fastify-decorators/blob/master/docs/Request-Handlers.md
