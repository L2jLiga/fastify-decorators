<h1 style="text-align: center">Fastify decorators</h1>

### Request handlers

Here the list of available HTTP methods decorators:

**@GET**, **@HEAD**, **@PATCH**, **@POST**, **@PUT**, **@OPTIONS**, **@DELETE**

There's also one special decorator for all methods: **@ALL**

#### Limitations:

- Decorators can't be mixed, and you can use only one decorator per class/method.

### Signatures:

Decorators have same signature, which consist of two overloads:

_First overload_:
| name | type | required | default | description |
|---------|---------------------------|:--------:|:-------:|--------------------------------------------------|
| url | `string` | no | `/` | Route url which will be passed to Fastify |
| options | [`RouteShorthandOptions`] | no | `{}` | Config for route which will be passed to Fastify |

_Second overload_:
| name | type | required | default | description |
|---------|-----------------|:--------:|:-------:|----------------------------------------------|
| url | `RouteOptions` | no | `{}` | Route url and config to be passed to Fastify |

### Request handler per class

Every handler should extend base `RequestHandler` class:

```ts
import { GET, RequestHandler } from 'fastify-decorators';

@GET('/')
class MyRequestHandler extends RequestHandler {
  async handler() {} // concrete implementation of abstract method in RequestHandler
}
```

### Request handler per method

In controllers you can decorate every method with one of the request decorators:

```ts
import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET } from 'fastify-decorators';

@Controller()
class MyController {
  @GET()
  async handler(request: FastifyRequest, reply: FastifyReply) {}
}
```

### Creating hooks

There are also decorator which allows using [Fastify Hooks]:

```ts
import { GET, Hook } from 'fastify-decorators';

@GET('/')
export default class Handler extends RequestHandler {
  public handle(): Promise<never> {
    return Promise.reject({ code: 'NOT_IMPLEMENTED' });
  }

  @Hook('onSend')
  async onSend(request, reply) {
    reply.removeHeader('X-Powered-By');
  }
}
```

### Error handling

`fastify-decorators` provides abilities to handle error with `@ErrorHandler` decorator.

Decorator may accept error code or type to handle or be empty which means will handle all errors. Let's take a look on example:

```ts
import { FastifyReply, FastifyRequest } from 'fastify';
import { ErrorHandler, GET, RequestHandler } from 'fastify-decorators';

@GET('/handler-with-error')
export default class HandlerWithErrorHandler extends RequestHandler {
  public handle(): Promise<never> {
    return Promise.reject({ code: 'NOT_IMPLEMENTED' });
  }

  @ErrorHandler('NOT_IMPLEMENTED')
  handleNotImplemented(error: Error, request: FastifyRequest, reply: FastifyReply): void {
    reply.status(422).send({ message: 'Not implemented' });
  }
}
```

[fastify hooks]: https://github.com/fastify/fastify/blob/master/docs/Hooks.md
[`routeshorthandoptions`]: https://github.com/fastify/fastify/blob/master/docs/Routes.md#shorthand-declaration
