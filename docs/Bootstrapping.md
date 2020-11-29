<h1 style="text-align: center">Fastify decorators</h1>

Bootstrapping is the process of starting up, in this stage library initialize all controllers, services and their dependencies.
This Initialization is done before Fastify instance starts listen.

### Autoload all controllers

One of the options to bootstrap app is autoload feature, it uses path and mask to load controllers and/or handlers.

*Example*:
```ts
import { fastify } from 'fastify'
import { bootstrap } from 'fastify-decorators'
import { join } from 'path'

const app = fastify()

app.register(bootstrap, {
  directory: __dirname,
  mask: /\.controller\./
})
```

### Specifying controllers list

Second option available is to specify all required controllers and/or handlers via array. This way you will have more granular control on whatever to load.

*Example*:
```ts
import { fastify } from 'fastify'
import { bootstrap } from 'fastify-decorators'
import { join } from 'path'

import MyController from './my-controller.js'
import { SecondController } from './second-controller.js'

const app = fastify()

app.register(bootstrap, {
  controllers: [
    MyController,
    SecondController
  ],
})
```

#### Limitations:
- It's not possible to use `getInstanceByToken` for getting `FastifyInstance` in static fields or decorators options:

   ```ts
   import { Controller, FastifyInstanceToken, getInstanceByToken } from 'fastify-decorators'
  
   @Controller()
   class InstanceController {
     // Will throw an error when bootstrap via controllers list
     // This happens because "FastifyInstance" not available before "bootstrap" call but required when controller imported
     static instance = getInstanceByToken(FastifyInstanceToken)
   }
   ```
