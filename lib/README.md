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

**NOTE**: Using decorators require `experimentalDecorators` to be enabled in `tsconfig.json`

otherwise decorators won't work but you still can use it without them:
```typescript
import { GET, RequestHandler } from 'fastify-decorators';

class SampleHandler extends RequestHandler {
    async handle() {
        return 'It works!';
    }
}

// BTW decorators is just a functions :)
export = GET({ url: '/sample' })(SampleHandler);
```

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

List of available decorators:
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

#### Decorators options
| name    | type            | required | description                                      |
|---------|-----------------|:--------:|--------------------------------------------------|
| url     | `string`        | yes      | Route url which will be passed to Fastify        |
| options | [`RouteConfig`] | no       | Config for route which will be passed to Fastify |

## How it works

Under the hood decorators create static method `register` in your class and then bootstraper use it to register it.

It means that this code:
```typescript
import { PUT, RequestHandler } from 'fastify-decorators';

@PUT({
    url: '/sample'
})
class SimplePutHandler extends RequestHandler {
    async handle() {
        return this.request.body.message;
    }
}

export = SimplePutHandler;
```

becomes:
```typescript
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { REGISTER } from 'fastify-decorators';
import { IncomingMessage, ServerResponse } from 'http';

class SimplePutHandler {
    constructor(protected request: FastifyRequest<IncomingMessage>,
                protected reply: FastifyReply<ServerResponse>) {
    }

    async handle() {
        return this.request.body.message;
    }

    static [REGISTER] = (instance: FastifyInstance) => instance.put(`/sample`, {}, (req, res) => new SimplePutHandler(req, res).handle());
}

export = SimplePutHandler;
```

## License

This project licensed under [MIT License]

[Fastify]: https://npmjs.org/package/fastify
[MIT License]: https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
[`RouteConfig`]: https://github.com/fastify/fastify/blob/master/docs/Routes.md
