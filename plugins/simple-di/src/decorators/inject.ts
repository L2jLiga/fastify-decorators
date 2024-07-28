import { SERVICE_INJECTION } from '../symbols.js';
import { ensureServiceInjection } from './helpers/ensure-service-injection.js';

/**
 * Property decorator to inject dependencies
 * @param token - unique identifier of service to inject
 *
 * @example
 * Here's example how service could be injected:
 * ```typescript
 * class Service {
 *     @Inject('instance')
 *     private instance: FastifyInstance;
 * }
 * ```
 */
export function Inject(token: string | symbol | unknown): PropertyDecorator {
  return (target, propertyKey) => {
    ensureServiceInjection(target);

    target[SERVICE_INJECTION].push({ propertyKey, name: token });
  };
}
