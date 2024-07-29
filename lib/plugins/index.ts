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
export { Constructable, Registrable } from './shared-interfaces.js';

export { getHandlersContainer, getHooksContainer, getErrorHandlerContainer } from '../decorators/helpers/class-metadata.js';
export { IHook, IHandler, IErrorHandler } from '../interfaces/controller.js';
export { CREATOR } from '../symbols/index.js';

export { Container } from '../registry/container.js';
export { CLASS_LOADER } from './class-loader.js';
