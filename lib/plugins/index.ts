/**
 * Entrypoint for plugin development and integration.
 * Provides utilities to interact with library
 * life-cycle events, can be used in order to
 * customize controller creation, app startup
 * and teardown behavior.
 *
 * @packageDocumentation
 */

export * from './class-loader.js';
export * from './life-cycle.js';

export { CLASS_LOADER, ClassLoader } from './class-loader.js';

export { getMetadata } from '../decorators/interop/metadata.js';

export { Container } from '../registry/container.js';
export { getContainer } from '../utils/container-utils.js';
export { REGISTRABLE, REQUEST_HANDLER, HOOK, ERROR_HANDLER } from '../constants/symbols.js';
export { Registrable } from '../interfaces/registrable.js';
export { RequestHandlerDefinition } from '../interfaces/request-handler-definition.js';
export { HookDefinition } from '../interfaces/hook-definition.js';
export { ErrorHandlerDefinition } from '../interfaces/error-handler-definition.js';
