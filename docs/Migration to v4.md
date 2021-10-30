# Migration from v3.x to v4.x

This guide describes how to migrate from `fastify-decorators` v2 to v3.

_Note_: migration guide from v2.x to v3.x is [here](https://github.com/L2jLiga/fastify-decorators/blob/v3/docs/Migration%20to%20v3.md).

### Moving to ESM

#### What's changed

| v3        | v4       |
| --------- | -------- |
| CJS + ESM | only ESM |

#### How to reflect

In general there are only few steps to be done:

1. In `package.json`: set `"type"` field value to `"module"`
2. In `tsconfig.json`: set `"module"` to `ESNext` or `ES2020`
3. In `tsconfig.json`: set `"target"` to `ES2015` or newer

#### Q&A section

Q: How can I adjust tests to work properly with newer version?
A: See [Testing](./Testing.md) documentation

Q: I'm using `__dirname` or `__filename` in my project
A: There's "polyfill" for them, just add this lines to file which uses these variables:

```typescript
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

### Built-in DI was moved to plugin

[`@fastify-decorators/simple-di`]: https://www.npmjs.com/package/@fastify-decorators/simple-di

#### What's changed

| v3          | v4                                            |
| ----------- | --------------------------------------------- |
| Built-in DI | DI moved to [`@fastify-decorators/simple-di`] |

#### How to reflect

In order to keep previous behavior there are 3 steps:

1. Add `@fastify-decorators/simple-di` to your application with your favorite package manager
2. Remove `reflect-metadata` and explicit import of this library, simple-di package will import it itself
3. Update imports in your application, for example:

   _Before_:

   ```typescript
   import { Controller, GET, Initializer, Inject, Service } from 'fastify-decorators';

   @Service()
   class SampleService {
     @Initializer()
     async initializeService() {
       // some async stuff here
     }
   }

   @Controller('/')
   export class SampleController {
     @Inject(SampleService)
     private service!: SampleService;

     @GET()
     async handleRequest() {
       // some stuff with service
     }
   }
   ```

   _After_:

   ```typescript
   import { Controller, GET } from 'fastify-decorators';
   import { Initializer, Inject, Service } from '@fastify-decorators/simple-di';

   @Service()
   class SampleService {
     @Initializer()
     async initializeService() {
       // some async stuff here
     }
   }

   @Controller('/')
   export class SampleController {
     @Inject(SampleService)
     private service!: SampleService;

     @GET()
     async handleRequest() {
       // some stuff with service
     }
   }
   ```
