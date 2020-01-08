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

## Getting fastify instance

In v2 `AbstractController` was deprecated in favor of dependency injection (`@Inject` decorator) and `getInstanceByToken` function.
If you use to extends from `AbstractController` to get fastify instance then you need to adapt your code to use DI:

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

*Note*: if you tried before to use instance in decorators (for example for prevalidation) and faced with errors with `getInstanceByToken` it's possible now:

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
