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

### Fastify Lifecycle:

Please refer to [Fastify docs]

[Fastify docs]: https://fastify.dev/docs/latest/Reference/Lifecycle
