[![Fastify decorators](./assets/logo.png)](https://github.com/L2jLiga/fastify-decorators)

[![npm version](https://badge.fury.io/js/fastify-decorators.svg?colorB=brightgreen)](https://www.npmjs.com/package/fastify-decorators)
[![Jetbrains plugin version](https://img.shields.io/jetbrains/plugin/v/13801.svg)](https://plugins.jetbrains.com/plugin/13801)
[![npm](https://img.shields.io/npm/dm/fastify-decorators.svg?colorB=brightgreen)](https://www.npmjs.com/package/fastify-decorators)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

[![Node.js CI](https://github.com/L2jLiga/fastify-decorators/workflows/Node.js%20CI/badge.svg)](https://github.com/L2jLiga/fastify-decorators/actions?query=workflow%3A%22Node.js+CI%22)
[![codecov](https://codecov.io/gh/L2jLiga/fastify-decorators/branch/v3/graph/badge.svg)](https://codecov.io/gh/L2jLiga/fastify-decorators)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/L2jLiga/fastify-decorators.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/L2jLiga/fastify-decorators/context:javascript)

> **Framework aimed to provide useful TypeScript decorators to implement controllers, services and request handlers, built with [Fastify].**

**NOTE**: fastify-decorators was developed with fastify `^3.0.0` and may not work with other versions.

## Benefits

- **Fastify compatible** - Built with [Fastify] and supports all its features and plugins
  - **JSON Schema validation** - Build [JSON Schemas](https://json-schema.org/) to validate and speedup your requests and replies
  - **High performance** - Framework adds as less overhead to Fastify as it can
- **Highly customizable** - Create your controllers, services and their methods as you wish
- **100% TypeScript** - Written in [TypeScript](https://www.typescriptlang.org/) and comes with all the required typings
- **Plugins** - Library provides APIs to extend its functionality
  - [**Simple DI**](./plugins/simple-di) - Provides simple Dependency Injection interface to bind your services
  - [**TypeDI**](./plugins/typedi) - Provides integration with [TypeDI](https://npmjs.com/package/typedi)

## Documentation

- [Getting started](#getting-started)
- [Bootstrapping]
- [Controllers]
- [Request Handlers]
- [Services and dependency injection]
- [Testing]
- [Migration guide (V4)]

## IDE Support

- [JetBrains IDE plugin]

## Alternatives

- **[NestJS]** - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- **[Fastify Resty]** - Modern and declarative REST API framework for superfast and oversimplification backend development, build on top of Fastify and TypeScript.

## Getting started

Hello! Thank you for checking out fastify-decorators!

This documents aims to be gentle introduction to the fastify-decorators and its usages.

### Prerequisites

- Typescript
- Fastify
- typings for NodeJS (`@types/node` package installed)

### Install

Install with npm

```
npm i fastify-decorators --save
```

Install with yarn

```
yarn add fastify-decorators
```

### Additional TypeScript configuration

Fastify-decorators requires `experimentalDecorators` feature to be enabled. For this you need to update your TypeScript config:

_tsconfig.json_:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

_Note_: if you struggle which `target` please refer to table below:

| Node version | target |
| ------------ | ------ |
| 10.x         | es2018 |
| 12.x         | es2019 |
| 14.x         | es2020 |

`fastify-decorators` itself use `"target": "es2018"` to support NodeJS 10+ (see [Node.js ES2018 Support]).

### Your first server

#### Request handler way

Let's write your first server with request handler:

_Project structure_:

```
 ├── index.ts
 ├── handlers
 │    └── first.handler.ts
 └── tsconfig.json
```

_index.ts_:

```ts
import { bootstrap } from 'fastify-decorators';
import { resolve } from 'path';

// Require the framework and instantiate it
const instance = require('fastify')();

// Register handlers auto-bootstrap
instance.register(bootstrap, {
  // Specify directory with our handler
  directory: resolve(__dirname, `handlers`),

  // Specify mask to match only our handler
  mask: /\.handler\./,
});

// Run the server!
instance.listen(3000);
```

_handlers/first.handler.ts_:

```ts
import { GET, RequestHandler } from 'fastify-decorators';

@GET({
  url: '/hello',
})
export default class FirstHandler extends RequestHandler {
  async handle() {
    return 'Hello world!';
  }
}
```

#### Controllers way

fastify-decorators also provides way to build controllers with multiple handlers:

_Project structure_:

```
 ├── index.ts
 ├── controllers
 │    └── first.controller.ts
 └── tsconfig.json
```

_index.ts_:

```ts
import { bootstrap } from 'fastify-decorators';
import { resolve } from 'path';

// Require the framework and instantiate it
const instance = require('fastify')();

// Register handlers auto-bootstrap
instance.register(bootstrap, {
  // Specify directory with our controllers
  directory: resolve(__dirname, `controllers`),

  // Specify mask to match only our controllers
  mask: /\.controller\./,
});

// Run the server!
instance.listen(3000);
```

_controllers/first.controller.ts_:

```ts
import { Controller, GET } from 'fastify-decorators';

@Controller({ route: '/' })
export default class FirstController {
  @GET({ url: '/hello' })
  async helloHandler() {
    return 'Hello world!';
  }

  @GET({ url: '/goodbye' })
  async goodbyeHandler() {
    return 'Bye-bye!';
  }
}
```

Also, we need to enable `experimentalDecorators` feature in our TypeScript config

_tsconfig.json_:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

### Build and run server

After all our files done we have to build server before we can run it:

1. Add to our package.json script to build server:

   ```
   "scripts": {
     "build": "tsc"
   }
   ```

1. Run build script
   With npm:

   ```
   npm run build
   ```

   with yarn:

   ```
   yarn build
   ```

1. Start server
   ```
   node index.ts
   ```

Awesome, that was easy.

[node.js es2018 support]: https://node.green/#ES2018

## License

This project licensed under [MIT License]

[fastify]: https://npmjs.org/package/fastify
[jetbrains ide plugin]: https://plugins.jetbrains.com/plugin/13801-fastify-decorators
[mit license]: https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
[nestjs]: https://nestjs.com/
[fastify resty]: https://github.com/FastifyResty/fastify-resty
[bootstrapping]: ./docs/Bootstrapping.md
[controllers]: ./docs/Controllers.md
[request handlers]: ./docs/Request%20Handlers.md
[services and dependency injection]: ./docs/Services%20and%20dependency%20injection.md
[testing]: ./docs/Testing.md
[migration guide (v4)]: ./docs/Migration%20to%20v4.md
