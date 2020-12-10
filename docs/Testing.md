<h1 style="text-align: center">Fastify decorators</h1>

## Testing

### Table of content:

- [Notes about dependency injection](#notes-about-dependency-injection)
- [Using `configureControllerTest`](#using-configurecontrollertest)
- [Using `configureServiceTest`](#using-configureservicetest)
  - [Services without async initializer](#sync-service-testing)
  - [Services with async initializer](#async-service-testing)
- [Bootstrap whole server](#bootstrap-whole-server)

### Notes about dependency injection

fastify-decorators provide dependency injection functionality only when [`reflect-metadata`] required.

It leads to mandatory of requiring this package to tests as well.

As example for Jest you can take a look on our [`jest.environment.cjs`]

### Using `configureControllerTest`

The `configureControllerTest(options)` function registers a Controller and allow you to mock out the Services for testing functionality.
You can write tests validating behaviors corresponding to the specific result of Controller interacting with mocked services.

_Note_: if mock was not provided for one or more dependencies then originals will be used.

_Usage_:

```ts
import { FastifyInstance } from 'fastify';
import { configureControllerTest } from 'fastify-decorators/testing';
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
import { configureControllerTest, FastifyInstanceWithController } from 'fastify-decorators/testing';
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
import { configureServiceTest } from 'fastify-decorators/testing';
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
    const bearer =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6W119.0Dd6yUeJ4UbCr8WyXOiK3BhqVVwJFk5c53ipJBWenmc';

    const result = service.hasSufficientRole(bearer);

    expect(result).toBe(true);
  });
});
```

#### Async service testing

If service has method with `@Initializer` decorator, then `configureServiceTest` will return intersection of an instance and Promise.
You can work with service like it has no `@Initializer` unless you await it.

```ts
import { configureServiceTest } from 'fastify-decorators/testing';
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
    const bearer =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6W119.0Dd6yUeJ4UbCr8WyXOiK3BhqVVwJFk5c53ipJBWenmc';

    const result = service.hasSufficientRole(bearer);

    expect(result).toBe(true);
  });
});
```

### Bootstrap whole server

It also possible to test application by bootstrap everything. It comparable to normal run.
Difference is server will not run.

_Note_: read more at [Fastify testing documentation](https://github.com/fastify/fastify/blob/master/docs/Testing.md)

_Example_:

_src/index.ts_:

```ts
import fastify from 'fastify';

const instance = fastify({
  /* options */
});

/* your code */

export { instance };
```

_test/auth.spec.ts_:

```ts
import { instance } from '../src';

describe('Application: authorization', () => {
  beforeEach(() => {
    /* Setup logic for test */
  });
  afterEach(() => {
    /* Teardown logic for test */
  });

  it('should check credentials and reply with result', async () => {
    const payload = { login: 'test', password: 'test' };

    const result = await instance.inject({
      url: '/auth/authorize',
      method: 'POST',
      payload,
    });

    expect(JSON.parse(result.body)).toEqual({ message: 'ok' });
  });
});
```

[`reflect-metadata`]: http://npmjs.com/package/reflect-metadata
[`jest.environment.cjs`]: ../jest.environment.cjs
