<h1 style="text-align: center">Fastify decorators</h1>

Controller is class decorated with `@Controller` and designed to handle request to its routes.

### Creating controller

First step is to create a class and decorate it

```ts
import { Controller } from 'fastify-decorators';

@Controller()
export default class SimpleController {}
```

_Controller decorator configuration_:

Controller decorator may accept 2 kinds of options

1. String which represent route URL which will be the root path of our controller's endpoints.

   default is `'/'`

1. Object which contains `route` representing URL used as the root path and `type` for controller type.

   Controller must be one of the two types:

   - `ControllerType.SINGLETON` - creates single class instance for all requests
   - `ControllerType.REQUEST` - creates new class instance per request

### Creating handlers

Controller is able to handle different HTTP requests methods with different routes.
For that, we need to declare a controller class method and decorate it with HTTP method decorator.

_List of available decorators_: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, 'HEAD' and `OPTIONS`.
There also special decorator in place - `ALL` which will handle all types of request.

```ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, GET } from 'fastify-decorators';

@Controller()
export default class SimpleController {
  @GET()
  async getHandler(request: FastifyRequest, reply: FastifyReply) {
    return 'Hello world!';
  }

  @POST()
  async postHandler(request: FastifyRequest, reply: FastifyReply) {
    // Doing some activities here
  }
}
```

Read [Request Handlers] for more info.

### Injecting services

Controllers may depend on other services and for such cases library provides dependency injection mechanism.

To inject service you will need to decorate your service with `@Service` decorator.

_Example_:

```ts
import { Service } from 'fastify-decorators';

@Service()
export class MyService {}
```

After that you can inject the service into other service or controller with one of 3 ways:

_getInstanceByToken_:

```ts
import { getInstanceByToken, Controller } from 'fastify-decorators';
import { MyService } from './my-service';

@Controller()
export class MyController {
  myService: MyService = getInstanceByToken(MyService);
}
```

_Inject_:

```ts
import { Controller, Inject } from 'fastify-decorators';
import { MyService } from './my-service';

@Controller()
export class MyController {
  @Inject(MyService)
  myService!: MyService;
}
```

_Constructor parameters_:

```ts
import { Controller } from 'fastify-decorators';
import { MyService } from './my-service';

@Controller()
export class MyController {
  constructor(public myService: MyService) {}
}
```

Read [Services and dependency injection] for more info

### Creating hooks

There are also decorator which allows using [Fastify Hooks]:

```ts
import { Controller, Hook } from 'fastify-decorators';

@Controller('/')
export default class SimpleController {
  @Hook('onSend')
  async onSend(request, reply) {
    reply.removeHeader('X-Powered-By');
  }
}
```

### Error handling

`fastify-decorators` provides abilities to handle error with `@ErrorHandler` decorator.

`@ErrorHandler` may accept error code or type to handle or be empty which means will handle all errors. Let's take a look on example:

```ts
import fs from 'fs';
import path from 'path';
import { Controller, GET, ErrorHandler } from 'fastify-decorators';

class TokenNotFoundError extends Error {}

@Controller('/')
export default class SimpleController {
  @GET('/')
  async get(request, reply) {
    // may throw FS_READ_ERROR
    const content = fs.readFileSync(path.join(__dirname, request.query.fileName));

    if (!content.includes('token')) {
      throw new TokenNotFoundError('Token not found in file requested');
    }

    return { message: 'ok' };
  }

  @ErrorHandler(TokenNotFoundError)
  handleTokenNotFound(error: TokenNotFoundError, request, reply) {
    reply.status(403).send({ message: 'You have no access' });
  }
}
```

[request handlers]: ./Request%20Handlers.md
[services and dependency injection]: ./Services%20and%20dependency%20injection.md
[fastify hooks]: https://github.com/fastify/fastify/blob/master/docs/Hooks.md
[`routeconfig`]: https://github.com/fastify/fastify/blob/master/docs/Routes.md
