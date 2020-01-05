<h1 align="center">Fastify decorators</h1>

## Dependency injection

Dependency injection (DI) is widely used mechanism to autowire controller/service dependency.
In fastify-decorators DI only available for controllers.

## Getting started

Before we start use DI within app [`reflect-metadata`] library required to be installed and imported.

*Note*: do not forget to enable experimental support for auto-generated type metadata in your TypeScript project, you must add `"emitDecoratorMetadata": true` to your tsconfig.json file.
   - Please note that auto-generated type metadata may have issues with circular or forward references for types.

*index.ts*:
```typescript
import 'reflect-metadata';
import { bootstrap } from 'fastify-decorators';

const instance = require('fastify')();

instance.register(bootstrap, {
    directory: __dirname,
    mask: /\.controller\./
});

instance.listen(3000);
```

## Writing services

`Service` decorator used to make class injectable

*my-service.ts*:
```typescript
import { Service } from 'fastify-decorators';

@Service()
export class MyService {
  calculate() {
    doSmth();
  }
}
```

## Injecting into Controllers

*sample.controller.ts*:
```typescript
import { Controller, GET } from 'fastify-decorators';
import { MyService } from './my-service';

@Controller()
export class SampleController {
  constructor(private service: MyService) {}

  @GET()
  async index() {
    return this.service.doSmth();
  }
}
```

[`reflect-metadata`]: https://npmjs.org/package/reflect-metadata
