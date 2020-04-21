<h1 style="text-align: center">Fastify decorators</h1>

## Dependency injection

Dependency injection (DI) is widely used mechanism to autowire controller/service dependency.
In fastify-decorators DI only available for controllers.

## Getting started

Before we start use DI within app [`reflect-metadata`] library required to be installed and imported.

*Note*: do not forget to enable experimental support for auto-generated type metadata in your TypeScript project, you must add `"emitDecoratorMetadata": true` to your tsconfig.json file.
   - Please note that auto-generated type metadata may have issues with circular or forward references for types.

*index.ts*:
```typescript
import 'reflect-metadata';
import { bootstrap } from 'fastify-decorators';

const instance = require('fastify')();

instance.register(bootstrap, {
    directory: __dirname,
    mask: /\.controller\./
});

instance.listen(3000);
```

## Writing services

`Service` decorator used to make class injectable

*my-service.ts*:
```typescript
import { Service } from 'fastify-decorators';

@Service()
export class MyService {
  calculate() {
    doSmth();
  }
}
```

## Injecting into Controllers

Dependency may be injected via constructor like in example below:

*sample.controller.ts*:
```typescript
import { Controller, GET } from 'fastify-decorators';
import { MyService } from './my-service';

@Controller()
export class SampleController {
  constructor(private service: MyService) {}

  @GET()
  async index() {
    return this.service.doSmth();
  }
}
```

Another option to inject dependencies is `@Inject` decorator:

*sample.controller.ts*:
```typescript
import { Controller, GET, Inject } from 'fastify-decorators';
import { MyService } from './my-service';

@Controller()
export class SampleController {
  @Inject(MyService)
  private service!: MyService;

  @GET()
  async index() {
    return this.service.doSmth();
  }
}
```

And third one available option is to use `getInstanceByToken` function:

*sample.controller.ts*:
```typescript
import { Controller, GET, getInstanceByToken } from 'fastify-decorators';
import { MyService } from './my-service';

@Controller()
export class SampleController {
  private service = getInstanceByToken<MyService>(MyService);

  @GET()
  async index() {
    return this.service.doSmth();
  }
}
```

### Inject, getInstanceByToken and available tokens

When you use `@Inject` or `getInstanceByToken` you need to specify token, so what is token?
Token is kind of identifier of instance to inject.

By default, when you use `@Service` decorator it uses class object as token, and it can be changed by specifying token explicitly:

*my-service.ts*:
```typescript
import { Service } from 'fastify-decorators';

@Service('MyServiceToken')
class MyService {}
```

this way `MyService` injection token will be `MyServiceToken` string and this token can be used in both methods:

```typescript
import { getInstanceByToken } from 'fastify-decorators';
import { MyService } from './my-service.ts';

const service = getInstanceByToken<MyService>('MyServiceToken');
```

### Built-in tokens

| Token                  | Provides          | Description                             |
|------------------------|-------------------|-----------------------------------------|
| `FastifyInstanceToken` | `FastifyInstance` | Token used to provide `FastifyInstance` |

[`reflect-metadata`]: https://npmjs.org/package/reflect-metadata
