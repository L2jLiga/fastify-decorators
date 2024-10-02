import { FastifyError } from 'fastify';
import { ERROR_HANDLER } from '../constants/symbols.js';
import { getContainer } from '../utils/container-utils.js';
import { CombinedMethodDecorator, methodDecoratorFactory } from './interop/method-decorator.js';

export function ErrorHandler(error?: ErrorConstructor | string): CombinedMethodDecorator {
  return methodDecoratorFactory((target, metadata, property) => {
    const container = getContainer(metadata, ERROR_HANDLER);

    let accepts: (value: Error) => boolean = () => true;
    if (typeof error === 'string') {
      accepts = (value: Error) => (value as FastifyError).code === error;
    }
    if (typeof error === 'function') {
      accepts = (value: Error) => value instanceof error;
    }

    container.push({ accepts, handlerName: property });
  });
}
