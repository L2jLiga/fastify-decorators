<h1 style="text-align: center">Fastify decorators</h1>

Plugins are the way to extend Fastify and Fastify Decorators functionality.

## Plugins Development

### Plugins API:

Plugins API is exported under "fastify-decorators/plugins" entrypoint.
It includes common symbols and functions.

### Fastify Decorators Lifecycle:

Fastify decorators provides several hooks:

- `appInit` - executes after Fastify instance is created but before Fastify decorators starts initialization
- `beforeControllerCreation` - executes for each Controller/RequestHandler before instance created
- `afterControllerCreation` - executes for each Controller/RequestHandler after instance created
- `appReady` - executes when Fastify decorators done initialization
- `appDestroy` - executes before Fastify instance destroyed

### Class loader

"Class loader" is a function used to instantiate Controller/RequestHandler/Service/etc.
It accepts class itself and scope.

where:

- class itself could be Controller/RequestHandler or any other class type defined in the plugin (f.e. Service)
- scope is where this class were requested - FastifyInstance or FastifyRequest.

Registration of class loader SHOULD be done on `appInit` stage by decorating FastifyInstance.

*example*:

```typescript
import { CLASS_LOADER, createInitializationHook } from 'fastify-decorators/plugins';

createInitializationHook('appInit', (fastify) => {
  fastify.decorate(CLASS_LOADER, (clazz: new () => any, _scope) => new clazz)
})
```

### Handlers, Hooks and Error Handlers

In addition to normal Lifecycle hooks,
Fastify Decorators provides interfaces and symbols to interact with registered handlers and hooks.

This functionality can be used to implicitly decorate methods

*Example: log arguments when any hook is called*:

```typescript
import { FastifyInstance } from 'fastify';
import { createInitializationHook, Registrable, hasHooks, HOOKS, IHook } from 'fastify-decorators/plugins';

createInitializationHook('beforeControllerCreation', (fastifyInstance: FastifyInstance, target: Registrable) => {
  if (hasHooks(target)) {
    for (const hook of target[HOOKS]) { // hook has type IHook
      const _method = target[hook.handlerName];
      target[hook.handlerName] = function logged(...args: any) {
        console.log('Hook called with args: ', args)
        return _method.apply(this, args)
      }
    }
  }
})
```

### Fastify Lifecycle:

Please refer to [Fastify docs]

[Fastify docs]: https://fastify.dev/docs/latest/Reference/Lifecycle
