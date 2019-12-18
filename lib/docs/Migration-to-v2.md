# Migration from v1.x to v2.x

This guide describes how to migrate from `fastify-decorators` v1 to v2.

## Bootstrap application

In v2 bootstrap config was changed, we deprecate handlers and controllers separated directory/mask properties. You still can use your config as is until fastify-decorators v3.

*before*:
```typescript
import fastify = require('fastify');
import { bootstrap } from 'fastify-decorators';

const instance = fastify();
 
instance.register(bootstrap, {
    handlersDirectory: join(__dirname__, 'src'),
    handlersMask: /\.handler\./,
    controllersDirectory: join(__dirname__, 'src'),
    controllersMask: /\.controller\./,
});
```

*after*:
```typescript
import fastify = require('fastify');
import { bootstrap } from 'fastify-decorators';

const instance = fastify();
 
instance.register(bootstrap, {
    directory: join(__dirname__, 'src'),
    mask: /\.(controller|handler)\./,
});
```

## TBA
