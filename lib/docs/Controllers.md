<h1 align="center">Fastify decorators</h1>

## Bootstrap controllers
Let's imagine that:
- We already have the directory named `controllers` which contains all our handlers
- Each handler contains `.controller.` in it's name.

To make it works without manual loading we can use `bootstrap` method:
```typescript
import { bootstrap } from 'fastify-decorators';
import { join } from 'path';

// Require the framework and instantiate it
const instance = require('fastify')();

// Define bootstrap options
const bootstrapOptions = {
    // This option defines path to directory with files to load
    directory: join(__dirname, `controllers`),

    // This option defines which pattern should file match
    mask: /\.controller\./
};

// Register our bootstrap with options
instance.register(bootstrap, bootstrapOptions);
```

## Writing controllers

The Fastify decorators module exports set of decorators to implement controllers with multiple handlers and hooks.

### Base class

Every controller should be decorated with `@Controller` decorator and exported:
```typescript
import { Controller } from 'fastify-decorators';

@Controller('/')
export default class SimpleController {
}
```

### Handlers

To mark controller method as handler you have to use one of the following decorators:
- `ALL`
- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`
- `OPTIONS`
- `HEAD`

*example*:
```typescript
import { Controller, GET } from 'fastify-decorators';

@Controller('/')
export default class SimpleController {
    @GET('/')
    async getHandler(request, reply) {
        return 'Hello world!'
    }
}
```

### Controller configuration

Controller may have to different behaviours:
- `Singleton` (default) - creates single controller instance for all requests
- `Request` - creates new controller instance for each request

If you would like to use behaviour different to `Singleton` then you need specify it in decorator like in example below:

```typescript
import { Controller, ControllerType, GET } from 'fastify-decorators';

@Controller({
   route: '/',
   type: ControllerType.REQUEST,
})
export default class SimpleController {
    @GET('/')
    async getHandler(request, reply) {
        return 'Hello world!'
    }
}
```

### Requests handlers configuration

Not only controller but also handlers within may have complex configuration, to use it you can provide [`RouteConfig`] object instead of string in method decorator.
For example if we want to specify response type for our endpoint above we can use configuration object with schema specified:

 ```typescript
import { Controller, ControllerType, GET } from 'fastify-decorators';
 
@Controller({
  route: '/',
  type: ControllerType.REQUEST,
})
export default class SimpleController {
    @GET({
        url: '/',
        options: {
            schema: {
                response: {
                    200: { type: 'string' },
                },
            },
        },
    })
    async getHandler(request, reply) {
        return 'Hello world!'
    }
}
 ```

Decorators accept `RouteConfig` with follow fields:

| name    | type            | required | description                                      |
|---------|-----------------|:--------:|--------------------------------------------------|
| url     | `string`        | yes      | Route url which will be passed to Fastify        |
| options | [`RouteConfig`] | no       | Config for route which will be passed to Fastify |

**NOTE**: This decorators can't be mixed and you can use only one decorator per method.

### Dependency injection and access to Fastify instance

Main article [Dependency injection]

Since v2 `fastify-decorators` supports DI mechanism.
DI able to provide `FastifyInstance` for your controllers. It is possible via `@Inject` decorator:

```typescript
import { FastifyInstance } from 'fastify';
import { GET, ControllerType, Controller, Inject, FastifyInstanceToken } from 'fastify-decorators';

@Controller({
  route: '/',
  type: ControllerType.REQUEST,
})
export default class SimpleController {
    @Inject(FastifyInstanceToken)
    private instance!: FastifyInstance;

    @GET({
        url: '/',
        options: {
            schema: {
                response: {
                    200: { type: 'string' },
                },
            },
        },
    })
    async getHandler(request, reply) {
        return 'Hello world!'
    }

    @GET('/routes')
    async routes() {
        return this.instance.printRoutes();
    }
}
```

#### Accessing FastifyInstance in decorators

If you need `FastifyInstance` in decorators (for example to determine specific hooks for route) `fastify-decorators` provides `getInstanceByToken` function.
This function accepts injectable token which is `FastifyInstanceToken` for the instance.

*Note*: Be aware that instance property should be static otherwise decorators can not get access to it. 

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

### Hooks

There are also decorator which allows to use [Fastify Hooks]:
```typescript
import { Controller, Hook } from 'fastify-decorators';

@Controller('/')
export default class SimpleController {
    @Hook('onSend')
    async (request, reply) {
        reply.removeHeader('X-Powered-By');
    }
}
```

[Fastify Hooks]: https://github.com/fastify/fastify/blob/master/docs/Hooks.md
[`RouteConfig`]: https://github.com/fastify/fastify/blob/master/docs/Routes.md
[Dependency Injection]: ./Dependency-Injection.md
