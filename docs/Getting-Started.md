<h1 align="center">Fastify decorators</h1>

## Getting started
Hello! Thank you for checking out fastify-decorators!

This documents aims to be gentle introduction to the fastify-decorators and its usages.

### Prerequisites

- Typescript
- Fastify
- typings for node.js

### Install

Install with npm
```
npm i fastify-decorators --save
```
Install with yarn
```
yarn add fastify-decorators
```

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
import { join } from 'path';

// Require the framework and instantiate it
const instance = require('fastify')();

// Register handlers auto-bootstrap
instance.register(bootstrap, {
    // Specify directory with our handler
    handlersDirectory: join(__dirname, `handlers`),

    // Specify mask to match only our handler
    handlersMask: /\.handler\./
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
class FirstHandler extends RequestHandler {
    async handle() {
        return 'Hello world!';
    }
}

// Make handler accessible by bootstrap by exporting
export = FirstHandler;
```

Also we need to enable `experimentalDecorators` feature in our TypeScript config

*tsconfig.json*:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true
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
import { join } from 'path';

// Require the framework and instantiate it
const instance = require('fastify')();

// Register handlers auto-bootstrap
instance.register(bootstrap, {
    // Specify directory with our controllers
    controllersDirectory: join(__dirname, `controllers`),

    // Specify mask to match only our controllers
    controllersMask: /\.controller\./
});

// Run the server!
instance.listen(3000);
```

*handlers/first.controller.ts*:
```typescript
import { Controller, GET } from 'fastify-decorators';

@Controller({route: '/'})
class FirstController {
    @GET({url: '/hello'})
    async helloHandler() {
        return 'Hello world!';
    }

    @GET({url: '/goodbye'})
    async goodbyeHandler() {
        return 'Bye-bye!';
    }
}

// Make handler accessible by bootstrap by exporting
export = FirstController;
```

Also we need to enable `experimentalDecorators` feature in our TypeScript config

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
    yarn builf
    ```

1. Start server
    ```
    node index.js
    ```

Awesome, that was easy.