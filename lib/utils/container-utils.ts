import { Container } from '../registry/container.js';
import { ERROR_HANDLER, HOOK, REQUEST_HANDLER } from '../constants/symbols.js';
import { HookDefinition } from '../interfaces/hook-definition.js';
import { RequestHandlerDefinition } from '../interfaces/request-handler-definition.js';
import { ErrorHandlerDefinition } from '../interfaces/error-handler-definition.js';

// Well-known overloads

export function getContainer(metadata: Record<PropertyKey, unknown>, key: typeof REQUEST_HANDLER): Container<RequestHandlerDefinition>;
export function getContainer(metadata: Record<PropertyKey, unknown>, key: typeof HOOK): Container<HookDefinition>;
export function getContainer(metadata: Record<PropertyKey, unknown>, key: typeof ERROR_HANDLER): Container<ErrorHandlerDefinition>;
export function getContainer<T>(metadata: Record<PropertyKey, unknown>, key: PropertyKey): Container<T>;
/**
 * Extracts container from metadata
 */
export function getContainer<T>(metadata: Record<PropertyKey, unknown>, key: PropertyKey): Container<T> {
  if (!Object.hasOwn(metadata, key)) {
    metadata[key] = new Container();
  }

  return metadata[key] as Container<T>;
}
