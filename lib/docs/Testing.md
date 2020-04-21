<h1 style="text-align: center">Fastify decorators</h1>

## Testing

### Using `configureControllerTest`

The `configureControllerTest(options)` function registers a Controller and allow you to mock out the Services for testing functionality.
You can write tests validating behaviors corresponding to the specific result of Controller interacting with mocked services.

*Note*: if mock was not provided for one or more dependencies then originals will be used.

*Usage*:
```typescript
import { FastifyInstance } from 'fastify';
import { configureControllerTest } from 'fastify-decorators/testing';
import { AuthController } from '../src/auth.controller';
import { AuthService } from '../src/auth.service';

describe('Controller: AuthController', () => {
  let instance: FastifyInstance;
  const authService = { authorize: jest.fn() }

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

    expect(JSON.parse(result.body)).toEqual({ message: 'ok' });
  });
});
```

### Using `configureServiceTest`

The `configureControllerTest(options)` is pretty close to `configureControllerTest` the difference is that this method returns service with mocked dependencies.

*Note*: if mock was not provided for one or more dependencies then originals will be used.

*Usage*:
```typescript
import { configureServiceTest } from 'fastify-decorators/testing';
import { RolesService } from '../src/roles.service';
import { AuthService } from '../src/auth.service';

describe('Service: AuthService', () => {
  let service: AuthService;
  const rolesService = { isTechnical: jest.fn(), isAdmin: jest.fn() };

  beforeEach(async () => {
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

### Bootstrap whole server

It also possible to test application by bootstrap everything. It comparable to normal run.
Difference is server will not run.

*Note*: read more at [Fastify testing documentation](https://github.com/fastify/fastify/blob/master/docs/Testing.md)

*Example*:

*src/index.ts*:
```typescript
import fastify from 'fastify';

const instance = fastify({ /* options */ });

/* your code */

export { instance };
```

*test/auth.spec.ts*:
```typescript
import { instance } from '../src'

describe('Application: authorization', () => {
  beforeEach(() => { /* Setup logic for test */ });
  afterEach(() => { /* Teardown logic for test */ });

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
