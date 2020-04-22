# Migration from v1.x to v2.x

This guide describes how to migrate from `fastify-decorators` v1 to v2.

## Bootstrap application

Controllers and handlers loaders were unified into single loader. It means that bootstrap config need  to be updated following way:

*before*:
```typescript
import fastify = require('fastify');
import { bootstrap } from 'fastify-decorators';
import { resolve } from 'path';

const instance = fastify();
 
instance.register(bootstrap, {
    handlersDirectory: resolve(__dirname, 'src'),
    handlersMask: /\.handler\./,
    controllersDirectory: resolve(__dirname, 'src'),
    controllersMask: /\.controller\./,
});
```

*after*:
```typescript
import fastify = require('fastify');
import { bootstrap } from 'fastify-decorators';
import { resolve } from 'path';

const instance = fastify();
 
instance.register(bootstrap, {
    directory: resolve(__dirname, 'src'),
    mask: /\.(controller|handler)\./,
});
```

## Getting fastify instance

In v2 `AbstractController` was deprecated in favor of dependency injection (`@Inject` decorator) and `getInstanceByToken` function.
It means that Controllers which uses Fastify instance have to be adapted.

*before*:
```typescript
import { AbstractController, Controller, GET } from 'fastify-decorators';

@Controller({ route: '' })
export default class MyController extends AbstractController {
    @GET({ url: '' })
    public async getRoutes() {
        return this.instance.printRoutes();
    }
}
```

*after*:
```typescript
import { FastifyInstance } from 'fastify';
import { Controller, FastifyInstanceToken, GET, Inject } from 'fastify-decorators';

@Controller({ route: '' })
export default class MyController {
    @Inject(FastifyInstanceToken)
    private instance!: FastifyInstance;

    @GET({ url: '' })
    public async getRoutes() {
        return this.instance.printRoutes();
    }
}
```

*Note*: it makes possible to use fastify instance inside method decorators by using `getInstanceByToken` method:

```typescript
import { FastifyInstance } from 'fastify';
import { Controller, FastifyInstanceToken, GET, getInstanceByToken } from 'fastify-decorators';

@Controller({ route: '' })
export default class MyController {
    private static instance = getInstanceByToken<FastifyInstance>(FastifyInstanceToken);

    @GET({
        url: '',
        options: {
            preValidation: MyController.instance.preValidationDecorator
        }
    })
    public async validatedRoute() {
        /* Some stuff */
    }
}
```

## TBA
