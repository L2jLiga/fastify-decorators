<h1 style="text-align: center">Fastify decorators</h1>

## Dependency injection

Dependency injection (DI) is widely used mechanism to autowire controller/service dependency.
In fastify-decorators DI only available for controllers.

## Getting started

Before we start use DI within app [`reflect-metadata`] library required to be installed and imported.

_Note_: do not forget to enable experimental support for auto-generated type metadata in your TypeScript project, you must add `"emitDecoratorMetadata": true` to your tsconfig.json file.

- Please note that auto-generated type metadata may have issues with circular or forward references for types.

_index.ts_:

```ts
import 'reflect-metadata';

import { bootstrap } from 'fastify-decorators';
import { resolve } from 'path';

const instance = require('fastify')();

instance.register(bootstrap, {
  directory: resolve(__dirname),
  mask: /\.controller\./,
});

instance.listen(3000);
```

## Writing services

`Service` decorator used to make class injectable

_my-service.ts_:

```ts
import { Service } from 'fastify-decorators';

@Service()
export class MyService {
  calculate() {
    doSmth();
  }
}
```

## Dependency inversion

Library as well provides option to set token at fastify initialization in order to have top-down DI initialization:

_blog-service.ts_:

```typescript
export abstract class BlogService {
  abstract getBlogPosts(): Promise<Array<BlogPost>>;
}
```

_sqlite-blog-service.ts_:

```typescript
import { BlogService } from './blog-service.js';
import { BlogPost } from '../models/blog-post.js';

@Service()
export class SqliteBlogService extends BlogService {
  async getBlogPosts(): Promise<Array<BlogPost>> {
    /* ... */
  }
}
```

_sqlite-blog-service.ts_:

```typescript
import { BlogService } from './blog-service.js';
import { BlogPost } from '../models/blog-post.js';

export class MySQLBlogService extends BlogService {
  async getBlogPosts(): Promise<Array<BlogPost>> {
    /* ... */
  }
}
```

_blog-controller.ts_:

```typescript
import { BlogService } from '../services/blog-service.js';

@Controller({
  route: '/api/blogposts',
})
export class BlogController {
  constructor(private blogService: BlogService) {}

  @GET()
  public async getBlogPosts(req, res): Promise<Array<BlogPosts>> {
    return this.blogService.getBlogPosts();
  }
}
```

and finally set `BlogService` token in `index.ts`:

```typescript
if (environment === 'development') {
  injectables.injectService(BlogService, SqliteBlogService);
} else if (environment === 'production') {
  injectables.injectSingleton(BlogService, new MySQLBlogService());
}

fastify.register(bootstrap, {
  /* ... */
});
```

### Async service initialization

It's possible that some services may require async initialization, for example to setup database connection.
For such reasons library provides the special decorator called `@Initializer`.

Usage is quite simple, just annotate your async method with it:

_database.service.ts_:

```ts
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
      synchronize: true,
    });
  }
}
```

Services may depend on other async services for their init, for such reasons `@Initializer` accepts array of such services:

```ts
import { Initializer, Service } from 'fastify-decorators';
import { Message } from '../entity/message';
import { ConnectionService } from '../services/connection.service';
import { Repository } from 'typeorm';

@Service()
export class MessageFacade {
  private repository!: Repository<Message>;
  constructor(private connectionService: ConnectionService) {}

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

### Graceful services destroy

If you need to have stuff executed before service destroyed (e.g. close database connection) you can use `@Destructor` decorator:

```ts
import { Initializer, Destructor, Service } from 'fastify-decorators';
import { Message } from '../entity/message';
import { createConnection, Connection } from 'typeorm';

@Service()
export class ConnectionService {
  connection!: Connection;

  @Initializer()
  async init(): Promise<void> {
    this.connection = await createConnection();
  }

  @Destructor()
  async destroy(): Promise<void> {
    await this.connection.close();
  }
}
```

## Injecting into Controllers

The easiest way to inject dependencies to controllers is using constructors:

_sample.controller.ts_:

```ts
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

_sample.controller.ts_:

```ts
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

_sample.controller.ts_:

```ts
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

_my-service.ts_:

```ts
import { Service } from 'fastify-decorators';

@Service('MyServiceToken')
class MyService {}
```

this way `MyService` injection token will be `MyServiceToken` string and this token can be used in both methods:

```ts
import { getInstanceByToken } from 'fastify-decorators';
import { MyService } from './my-service.ts';

const service = getInstanceByToken<MyService>('MyServiceToken');
```

### Built-in tokens

| Token                  | Provides          | Description                             |
| ---------------------- | ----------------- | --------------------------------------- |
| `FastifyInstanceToken` | `FastifyInstance` | Token used to provide `FastifyInstance` |

[`reflect-metadata`]: https://npmjs.org/package/reflect-metadata
