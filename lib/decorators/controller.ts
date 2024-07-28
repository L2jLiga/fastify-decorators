import type { FastifyInstance } from 'fastify';
import type { ControllerConfig } from '../interfaces/index.js';
import { Constructable } from '../plugins/index.js';
import { ControllerType } from '../registry/controller-type.js';
import { CREATOR } from '../symbols/index.js';
import { ensureRegistrable } from './helpers/ensure-registrable.js';
import { ControllerTypeStrategies } from './strategies/controller-type.js';

function makeConfig(config: string | ControllerConfig = '/'): Required<ControllerConfig> {
  if (typeof config === 'string') config = { route: config };

  return { type: ControllerType.SINGLETON, route: '/', tags: [], ...config };
}

/**
 * Factory function which accepts controller configuration
 * and returns ES / Legacy decorator function to apply on class
 * @param config - route or ControllerConfig or nothing
 * @returns decorator for class
 */
export function Controller(): <T>(target: T, context?: ClassDecoratorContext) => void;
export function Controller(): ClassDecorator;
export function Controller(route: string): <T>(target: T, context?: ClassDecoratorContext) => void;
export function Controller(route: string): ClassDecorator;
export function Controller(config: ControllerConfig): <T>(target: T, context?: ClassDecoratorContext) => void;
export function Controller(config: ControllerConfig): ClassDecorator;
export function Controller(config?: string | ControllerConfig): unknown {
  return (controller: Constructable): void => {
    const { route, type, tags } = makeConfig(config);

    ensureRegistrable(controller);

    controller[CREATOR].register = async (instance: FastifyInstance, prefix = '') => {
      let controllerInstance;

      await instance.register(
        async (instance) => {
          controllerInstance = ControllerTypeStrategies[type](instance, controller, tags);
        },
        { prefix: prefix + route },
      );

      return controllerInstance;
    };
  };
}
