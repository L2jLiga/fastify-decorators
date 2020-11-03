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
import { resolve } from 'path';

const instance = require('fastify')();

instance.register(bootstrap, {
    directory: resolve(__dirname),
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

### Async service initialization

It's possible that some services may require async initialization, for example to setup database connection.
For such reasons library provides the special decorator called `@Initializer`.

Usage is quite simple, just annotate your async method with it:

*database.service.ts*:
```typescript
import { Initializer, Service } from 'fastify-decorators';
import { join } from 'path';
import { createConnection, Connection } from 'typeorm';
import { Message } from '../entity/message';

@Service()
export class ConnectionService {
    connection!: Connection;

    @Initializer()
    async init(): Promise<void> {
        this._connection = await createConnection({
            type: 'sqljs',
            autoSave: true,
            location: join(process.cwd(), 'db', 'database.db'),
            entities: [Message],
            logging: ['query', 'schema'],
            synchronize: true
        });
    }
}
```

Services may depend on other async services for their init, for such reasons `@Initializer` accepts array of such services:

```typescript
import { Initializer, Service } from 'fastify-decorators';
import { Message } from '../entity/message';
import { ConnectionService } from '../services/connection.service';
import { Repository } from "typeorm";

@Service()
export class MessageFacade {
    private repository!: Repository<Message>;
    constructor(private connectionService: ConnectionService) {
    }

    @Initializer([ConnectionService])
    async init(): Promise<void> {
        // because we added ConnectionService as a dependency, we are sure it was properly initialized if it reaches
        // this point
        this.repository = this.connectionService.connection.getRepository(Message);
    }

    async getMessages(): Promise<Message[]> {
        return this.repository.find();
    }
}
```

## Injecting into Controllers

The easiest way to inject dependencies to controllers is using constructors:

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

It's also possible to use `getInstanceByToken` function:

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
