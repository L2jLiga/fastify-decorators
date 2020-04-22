<h1 style="text-align: center">Fastify decorators</h1>

## Getting started
Hello! Thank you for checking out fastify-decorators!

This documents aims to be gentle introduction to the fastify-decorators and its usages.

### Prerequisites

- Typescript
- Fastify
- typings for node.js (`@types/node` package installed)

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

*tsconfig.json*:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }  
}
```

*Note*: if you struggle which `target` to choose we would like to propose `"target": "es2018"`.
This choice was made because `fastify-decorators` supports `node >= 10` and according to info from [Node.js ES2018 Support] this version and upper supports all `ES2018` features.

### Your first server
#### Request handler way
Let's write your first server with request handler:

*Project structure*:

```
 ├── index.ts
 ├── handlers
 │    └── first.handler.ts
 └── tsconfig.json
```

*index.ts*:
```typescript
import { bootstrap } from 'fastify-decorators';
import { resolve } from 'path';

// Require the framework and instantiate it
const instance = require('fastify')();

// Register handlers auto-bootstrap
instance.register(bootstrap, {
    // Specify directory with our handler
    directory: resolve(__dirname, `handlers`),

    // Specify mask to match only our handler
    mask: /\.handler\./
});

// Run the server!
instance.listen(3000);
```

*handlers/first.handler.ts*:
```typescript
import { GET, RequestHandler } from 'fastify-decorators';

@GET({
    url: '/hello'
})
export default class FirstHandler extends RequestHandler {
    async handle() {
        return 'Hello world!';
    }
}
```

#### Controllers way
fastify-decorators also provides way to build controllers with multiple handlers:


*Project structure*:

```
 ├── index.ts
 ├── controllers
 │    └── first.controller.ts
 └── tsconfig.json
```

*index.ts*:
```typescript
import { bootstrap } from 'fastify-decorators';
import { resolve } from 'path';

// Require the framework and instantiate it
const instance = require('fastify')();

// Register handlers auto-bootstrap
instance.register(bootstrap, {
    // Specify directory with our controllers
    directory: resolve(__dirname, `controllers`),

    // Specify mask to match only our controllers
    mask: /\.controller\./
});

// Run the server!
instance.listen(3000);
```

*controllers/first.controller.ts*:
```typescript
import { Controller, GET } from 'fastify-decorators';

@Controller({route: '/'})
export default class FirstController {
    @GET({url: '/hello'})
    async helloHandler() {
        return 'Hello world!';
    }

    @GET({url: '/goodbye'})
    async goodbyeHandler() {
        return 'Bye-bye!';
    }
}
```

Also, we need to enable `experimentalDecorators` feature in our TypeScript config

*tsconfig.json*:
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

[Node.js ES2018 Support]: https://node.green/#ES2018
