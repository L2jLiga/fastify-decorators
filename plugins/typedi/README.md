<h1 style="text-align: center">@fastify-decorators/typedi</h1>

[![npm version](https://badge.fury.io/js/@fastify-decorators%2Ftypedi.svg)](https://badge.fury.io/js/@fastify-decorators%2Ftypedi)
[![npm](https://img.shields.io/npm/dm/@fastify-decorators/typedi.svg?colorB=brightgreen)](https://www.npmjs.com/package/@fastify-decorators/typedi)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

## Dependency injection

Dependency injection (DI) is widely used mechanism to autowire controller/service dependency.
In fastify-decorators DI only available for controllers.

This plugin provides support for integration with [TypeDI](https://npmjs.com/package/typedi)

### Getting started

1. Install `@fastify-decorators/typedi` and `typedi`
2. Use TypeDI container in the app

   ```typescript
   import { useContainer } from '@fastify-decorators/typedi';
   import { fastify } from 'fastify';
   import { bootstrap } from 'fastify-decorators';
   import { dirname } from 'path';
   import { Container } from 'typedi';
   import { fileURLToPath } from 'url';

   useContainer(Container);

   export const app = fastify();

   app.register(bootstrap, {
     directory: dirname(fileURLToPath(import.meta.url)),
   });
   ```

3. Write services, annotate them with `@Service` and inject into controllers using `@Inject` from TypeDI

### Examples

- [Example 1](https://github.com/L2jLiga/fastify-decorators/tree/v4/examples/typedi)
