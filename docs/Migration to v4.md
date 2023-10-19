<h1 style="text-align: center">Fastify decorators</h1>

# Migration from v3.x to v4.x

This guide describes how to migrate from `fastify-decorators` v3 to v4.

_Note_: migration guide from v2.x to v3.x is [here](https://github.com/L2jLiga/fastify-decorators/blob/v3/docs/Migration%20to%20v3.md).

### Minimal Fastify/TypeScript/Node.js version changed

Update dependencies:

| Dependency | Minimal supported version |
| ---------- | ------------------------- |
| Node.js    | 20.8.1                    |
| TypeScript | 5.0.0                     |
| Fastify    | 4.0.0                     |

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
