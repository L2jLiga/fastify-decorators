<h1 style="text-align: center">Fastify decorators</h1>

Bootstrapping is the process of starting up, in this stage library initialize all controllers, services and their dependencies.
This Initialization is done before Fastify instance starts listen.

### Autoload all controllers

One of the options to bootstrap app is autoload feature, it uses path and mask to load controllers and/or handlers.

_Example_:

```ts
import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { join } from 'path';

const app = fastify();

app.register(bootstrap, {
  directory: __dirname,
  mask: /\.controller\./,
});
```

### Specifying controllers list

Second option available is to specify all required controllers and/or handlers via array. This way you will have more granular control on whatever to load.

_Example_:

```ts
import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { join } from 'path';

import MyController from './my-controller.js';
import { SecondController } from './second-controller.js';

const app = fastify();

app.register(bootstrap, {
  controllers: [MyController, SecondController],
});
```

### Using custom class loader

By default, fastify-decorators uses own DI mechanism for getting controller instances.
This mechanism depends on `reflect-metadata` and provide basic abilities like constructor injection and injection to class fields via decorators.

You can read more about built-in DI at [Services and dependency injection](Services%20and%20dependency%20injection.md)

In case when built-in DI does not suitable it's possible to write own custom loader for classes and pass it via `classLoader` option.
Signature is `(clazz: Constructor<C>) => C`.

```typescript
import 'reflect-metadata';
import { Container } from 'typedi';

app.register(bootstrap, {
  // ...other options...
  classLoader(clazz) {
    return Container.get(clazz);
  },
});
```

#### Limitations:

- It's not possible to use `getInstanceByToken` for getting `FastifyInstance` in static fields or decorators options:

  ```ts
  import { Controller, FastifyInstanceToken, getInstanceByToken } from 'fastify-decorators';

  @Controller()
  class InstanceController {
    // Will throw an error when bootstrap via controllers list
    // This happens because "FastifyInstance" not available before "bootstrap" call but required when controller imported
    static instance = getInstanceByToken(FastifyInstanceToken);
  }
  ```
