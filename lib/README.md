# Fastify decorators

This package developed to provide some useful typescript decorators to implement [RequestHandler] pattern with [Fastify].

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
import { FastifyRequest, FastifyReply } from 'fastify';
import { GET, RequestHandler } from 'fastify-decorators';
import { IncommingMessage, ServerResponse } from 'http';

@GET({
    url: '/sample'
})
class SampleHandler implements RequestHandler {
    constructor(public request: FastifyRequest<IncommingMessage>,
                public reply: FastifyReply<ServerResponse>) {}
    
    async handle() {
        return 'It works!';
    }
}
```

## License

This project licensed under [MIT License]

[RequestHandler]: https://java-design-patterns.com/patterns/chain/
[Fastify]: https://npmjs.org/package/fastify
[MIT License]: https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
