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
        return 'It works!';
    }

    static register() {
        // something
    }
}
```

## License

This project licensed under [MIT License]

[Fastify]: https://npmjs.org/package/fastify
[MIT License]: https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
