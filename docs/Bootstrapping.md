<h1 style="text-align: center">Fastify decorators</h1>

Bootstrapping is the process of starting up, in this stage library initialize all controllers, services and their dependencies.
This Initialization is done before Fastify instance starts listen.

### Autoload all controllers

One of the options to bootstrap app is autoload feature, it uses path and mask to load controllers and/or handlers.

_Example_:

```typescript
import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = fastify();

app.register(bootstrap, {
  directory: dirname(fileURLToPath(import.meta.url)),
  mask: /\.controller\./,
});
```

### Specifying controllers list

Second option available is to specify all required controllers and/or handlers via array. This way you will have more granular control on whatever to load.

_Example_:

```typescript
import { fastify } from 'fastify';
import { bootstrap } from 'fastify-decorators';

// With default export
import MyController from './my-controller.js';

// With named export
import { SecondController } from './second-controller.js';

const app = fastify();

app.register(bootstrap, {
  controllers: [MyController, SecondController],
});
```
