<h1 style="text-align: center">@fastify-decorators/simple-di</h1>

[![npm version](https://badge.fury.io/js/@fastify-decorators%2Fsimple-di.svg)](https://badge.fury.io/js/@fastify-decorators%2Fsimple-di)
[![npm](https://img.shields.io/npm/dm/@fastify-decorators/simple-di.svg?colorB=brightgreen)](https://www.npmjs.com/package/@fastify-decorators/simple-di)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

## Dependency injection

Dependency injection (DI) is widely used mechanism to autowire controller/service dependency.
In fastify-decorators DI only available for controllers.

## Table of Content

- [Getting started](#getting-started)
- [Writing services](#writing-services)
  - [Async service initialization](#async-service-initialization)
  - [Graceful service destroy](#graceful-services-destroy)
- [Injecting into Controllers](#injecting-into-controllers)
  - [Inject, getInstanceByToken and available tokens](#inject-getinstancebytoken-and-available-tokens)
  - [Built-in tokens](#built-in-tokens)
    - [Limitations](#limitations)
- [Testing](#testing)
  - [Using `configureControllerTest`](#using-configurecontrollertest)
    - [Accessing controller instance](#accessing-controller-instance)
  - [Using `configureServiceTest`](#using-configureservicetest)
    - [Sync service testing](#sync-service-testing)
    - [Async service testing](#async-service-testing)

## Getting started

There's few simple steps to enable this library:

1. Install `@fastify-decorators/simple-di`
2. Enable `"experimentalDecorators"` as `"emitDecoratorMetadata"` in `tsconfig.json`

_Note_: auto-generated type metadata may have issues with circular or forward references for types.

## Writing services

`Service` decorator used to make class injectable

_my-service.ts_:

```ts
import { Service } from '@fastify-decorators/simple-di';

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

_database.service.ts_:

```ts
import { Initializer, Service } from '@fastify-decorators/simple-di';
import { join } from 'node:path';
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
import { Initializer, Service } from '@fastify-decorators/simple-di';
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
import { Initializer, Destructor, Service } from '@fastify-decorators/simple-di';
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
import { Controller, GET } from 'fastify-decorators';
import { Inject } from '@fastify-decorators/simple-di';
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
import { Controller, GET } from 'fastify-decorators';
import { getInstanceByToken } from '@fastify-decorators/simple-di';
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
import { Service } from '@fastify-decorators/simple-di';

@Service('MyServiceToken')
class MyService {}
```

this way `MyService` injection token will be `MyServiceToken` string and this token can be used in both methods:

```ts
import { getInstanceByToken } from '@fastify-decorators/simple-di';
import { MyService } from './my-service.ts';

const service = getInstanceByToken<MyService>('MyServiceToken');
```

### Built-in tokens

| Token                  | Provides          | Description                             |
| ---------------------- | ----------------- | --------------------------------------- |
| `FastifyInstanceToken` | `FastifyInstance` | Token used to provide `FastifyInstance` |

#### Limitations:

- It's not possible to use `getInstanceByToken` for getting `FastifyInstance` in static fields or decorators options:

  ```typescript
  import { Controller, FastifyInstanceToken, getInstanceByToken } from 'fastify-decorators';

  @Controller()
  class InstanceController {
    // Will throw an error when bootstrap via controllers list
    // This happens because "FastifyInstance" not available before "bootstrap" call but required when controller imported
    static instance = getInstanceByToken(FastifyInstanceToken);
  }
  ```

## Testing

### Using `configureControllerTest`

The `configureControllerTest(options)` function registers a Controller and allow you to mock out the Services for testing functionality.
You can write tests validating behaviors corresponding to the specific result of Controller interacting with mocked services.

_Note_: if mock was not provided for one or more dependencies than originals will be used.

_Usage_:

```ts
import { FastifyInstance } from 'fastify';
import { configureControllerTest } from '@fastify-decorators/simple-di/testing';
import { AuthController } from '../src/auth.controller';
import { AuthService } from '../src/auth.service';

describe('Controller: AuthController', () => {
  let instance: FastifyInstance;
  const authService = { authorize: jest.fn() };

  beforeEach(async () => {
    instance = await configureControllerTest({
      controller: AuthController,
      mocks: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    });
  });
  afterEach(() => jest.restoreAllMocks());

  it(`should reply with 'ok' if authorization success`, async () => {
    authService.authorize.and.returnValue(Promise.resolve(true));

    const result = await instance.inject({
      url: '/authorize',
      method: 'POST',
      payload: { login: 'test', password: 'test' },
    });

    expect(result.json()).toEqual({ message: 'ok' });
  });
});
```

#### Accessing controller instance

The `configureControllerTest` decorate Fastify instance with `controller` property which may be used to access controller instance.

_Note_: controller will be `undefined` in case "per request" type is used.

_Example_:

```ts
import { FastifyInstance } from 'fastify';
import { configureControllerTest, FastifyInstanceWithController } from '@fastify-decorators/simple-di/testing';
import { AuthController } from '../src/auth.controller';

describe('Controller: AuthController', () => {
  let instance: FastifyInstanceWithController<AuthController>;

  beforeEach(async () => {
    instance = await configureControllerTest({
      controller: AuthController,
    });
  });
  afterEach(() => jest.restoreAllMocks());

  it(`should reply with 'ok' if authorization success`, async () => {
    const controllerInstance = instance.controller;
    jest.spyOn(controllerInstance, 'authorize').mockReturnValue(Promise.resolve({ message: 'ok' }));

    const result = await instance.inject({
      url: '/authorize',
      method: 'POST',
      payload: { login: 'test', password: 'test' },
    });

    expect(result.json()).toEqual({ message: 'ok' });
  });
});
```

### Using `configureServiceTest`

The `configureControllerTest(options)` is pretty close to `configureControllerTest` the difference is that this method returns service with mocked dependencies.

_Note_: if mock was not provided for one or more dependencies then originals will be used.

#### Sync service testing

For those services which has no method with `@Initializer` decorator, then `configureServiceTest` will return an instance of it.

_Usage_:

```ts
import { configureServiceTest } from '@fastify-decorators/simple-di/testing';
import { RolesService } from '../src/roles.service';
import { AuthService } from '../src/auth.service';

describe('Service: AuthService', () => {
  let service: AuthService;
  const rolesService = { isTechnical: jest.fn(), isAdmin: jest.fn() };

  beforeEach(() => {
    service = configureServiceTest({
      service: AuthService,
      mocks: [
        {
          provide: RolesService,
          useValue: rolesService,
        },
      ],
    });
  });
  afterEach(() => jest.restoreAllMocks());

  it(`should reply with 'ok' if authorization success`, async () => {
    rolesService.isTechnical.and.returnValue(true);
    rolesService.isAdmin.and.returnValue(false);
    const bearer = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6W119.0Dd6yUeJ4UbCr8WyXOiK3BhqVVwJFk5c53ipJBWenmc';

    const result = service.hasSufficientRole(bearer);

    expect(result).toBe(true);
  });
});
```

#### Async service testing

If service has method with `@Initializer` decorator, then `configureServiceTest` will return intersection of an instance and Promise.
You can work with service like it has no `@Initializer` unless you await it.

```ts
import { configureServiceTest } from '@fastify-decorators/simple-di/testing';
import { RolesService } from '../src/roles.service';
import { AuthService } from '../src/auth.service';

describe('Service: AuthService', () => {
  let service: AuthService;
  const rolesService = { isTechnical: jest.fn(), isAdmin: jest.fn() };

  beforeEach(async () => {
    service = await configureServiceTest({
      service: AuthService,
      mocks: [
        {
          provide: RolesService,
          useValue: rolesService,
        },
      ],
    });
  });
  afterEach(() => jest.restoreAllMocks());

  it(`should reply with 'ok' if authorization success`, async () => {
    rolesService.isTechnical.and.returnValue(true);
    rolesService.isAdmin.and.returnValue(false);
    const bearer = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6W119.0Dd6yUeJ4UbCr8WyXOiK3BhqVVwJFk5c53ipJBWenmc';

    const result = service.hasSufficientRole(bearer);

    expect(result).toBe(true);
  });
});
```
