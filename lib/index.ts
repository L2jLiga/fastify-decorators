/**
 * Fastify-decorators is a library-wrapper
 * around the Fastify, it providers set of
 * decorators.
 *
 * Decorators can be used to declare controllers,
 * their requests handlers and life-cycle hooks.
 *
 * @packageDocumentation
 */
import './polyfills.js';

export { bootstrap } from './bootstrap/bootstrap.js';
export { BootstrapConfig } from './interfaces/bootstrap-config.js';

export { Controller, ControllerConfig } from './decorators/controller.js';
export { RequestHandler } from './interfaces/request-handler.js';
export { ALL, DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT, REQUEST, RouteConfig } from './decorators/request-handlers.js';
export { ErrorHandler } from './decorators/error-handler.js';
export { Hook } from './decorators/hook.js';

export { Scope } from './constants/scope.js';
