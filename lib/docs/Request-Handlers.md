<h1 style="text-align: center">Fastify decorators</h1>

## Bootstrap request handlers

Let's imagine that:
- We already have the directory named `handlers` which contains all our handlers
- Each handler contains `.handler.` in its name.

To make it works without manual loading we can use `bootstrap` method:
```typescript
import { bootstrap } from 'fastify-decorators';
import { join } from 'path';

// Require the framework and instantiate it
const instance = require('fastify')();

// Define bootstrap options
const bootstrapOptions = {
    // This option defines which directory should be scanned for handlers
    directory: join(__dirname, `handlers`),

    // This option defines which pattern should file match
    mask: /\.handler\./
};

// Register our bootstrap with options
instance.register(bootstrap, bootstrapOptions);
```

## Writing request handlers

The Fastify decorators module exports set of decorators to implement RequestHandler pattern (one handler per class).

### Base class

Every handler should extend base `RequestHandler` class:
```typescript
import { RequestHandler } from 'fastify-decorators';

class MyRequestHandler extends RequestHandler {
    async handler() {} // concrete implementation of abstract method in RequestHandler
}
```

### Decorators

Decorators are required to bootstrap application automatically. They are patch class to make it possible. 

All available decorators:
- `ALL`
- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`
- `OPTIONS`
- `HEAD`

These decorators can't be mixed, and you can use only one decorator per class.

Decorators accept `RouteConfig` with follow fields:

| name    | type            | required | description                                      |
|---------|-----------------|:--------:|--------------------------------------------------|
| url     | `string`        | yes      | Route url which will be passed to Fastify        |
| options | [`RouteConfig`] | no       | Config for route which will be passed to Fastify |


Finally, after applying decorator with options your handler will look like:
```typescript
import { ALL, RequestHandler } from 'fastify-decorators';

@ALL({url: '/'})
class MyRequestHandler extends RequestHandler {
    async handler() {} // concrete implementation of abstract method in RequestHandler
}
```

### Exporting handlers

Any handler should export itself to be available for bootstrap. There are three ways to export them:

*default export*:
```typescript
import { ALL, RequestHandler } from 'fastify-decorators';

@ALL({url: '/'})
export default class MyRequestHandler extends RequestHandler {
    async handler() {} // concrete implementation of abstract method in RequestHandler
}
```

*export*:
```typescript
import { ALL, RequestHandler } from 'fastify-decorators';

@ALL({url: '/'})
class MyRequestHandler extends RequestHandler {
    async handler() {} // concrete implementation of abstract method in RequestHandler
}

export = MyRequestHandler;
```

*module.exports*:
```typescript
import { ALL, RequestHandler } from 'fastify-decorators';

@ALL({url: '/'})
class MyRequestHandler extends RequestHandler {
    async handler() {} // concrete implementation of abstract method in RequestHandler
}

module.exports = MyRequestHandler;
```

## How it works

We use symbols which are not public APIs.
These symbols are added to your handlers/controllers and services.
When `bootstrap` method called it is searching for all files by a mask and load configuration from these symbols value.

It means that this code:
```typescript
import { PUT, RequestHandler } from 'fastify-decorators';

@PUT({
    url: '/sample'
})
export default class SimplePutHandler extends RequestHandler {
    async handle() {
        return this.request.body.message;
    }
}
```

becomes:
```typescript
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { CREATOR } from 'fastify-decorators/symbols';
import { IncomingMessage, ServerResponse } from 'http';

export default class SimplePutHandler {
    constructor(protected request: FastifyRequest<IncomingMessage>,
                protected reply: FastifyReply<ServerResponse>) {
    }

    async handle() {
        return this.request.body.message;
    }

    static [CREATOR] = {
        register(instance: FastifyInstance) {
            instance.put(`/sample`, (req, res) => new SimplePutHandler(req, res).handle())
        }
    };
}
```

[`RouteConfig`]: https://github.com/fastify/fastify/blob/master/docs/Routes.md
