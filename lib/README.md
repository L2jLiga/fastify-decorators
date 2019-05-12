# Fastify decorators

This package developed to provide useful typescript decorators to implement RequestHandler pattern with [Fastify].

**NOTE**: Fastify-decorators was developed with fastify `^2.0.0` and may not work with other versions.

## Basic usage

index.ts
```typescript
import {bootstrap} from 'fastify-decorators';
import fastify = require('fastify');

const instance = fastify();

instance.register(bootstrap, {
    handlersDirectory: path.join(__dirname, `handlers`),
    handlersMask: /\.handler\./
});

instance.listen(3000);
```

handlers/sample.handler.ts
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
import { IncomingMessage, ServerResponse } from 'http';

class SimplePutHandler {
    constructor(protected request: FastifyRequest<IncomingMessage>,
                protected reply: FastifyReply<ServerResponse>) {
    }

    async handle() {
        return this.request.body.message;
    }
    
    static register = (instance: FastifyInstance) => instance.put(`/sample`, {}, (req, res) => new SimplePutHandler(req, res).handle());
}

export = SimplePutHandler;
```

## Restrictions

To get it work you should not implement static method/field/accessor named `register` as it used by decorators to auto bootstrap handlers.

**Don't**:
```typescript
import { GET, RequestHandler } from 'fastify-decorators';

@GET({
    url: '/sample'
})
class SampleHandler extends RequestHandler {
    async handle() {
        return SampleHandler.register;
    }

    static register = "It does not work";
}

export = SampleHandler
```

## License

This project licensed under [MIT License]

[Fastify]: https://npmjs.org/package/fastify
[MIT License]: https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
