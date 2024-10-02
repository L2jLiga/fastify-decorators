import { FastifyInstance } from 'fastify';
import { REGISTRABLE } from '../../constants/symbols.js';
import { Scope } from '../../constants/scope.js';
import { ControllerTypeStrategies } from '../strategies/controller-type.js';
import { TagObject } from './swagger-helper.js';

export function makeRegistrable(
  target: object & { [REGISTRABLE]?: (instance: FastifyInstance) => Promise<unknown> },
  metadata: Record<PropertyKey, unknown>,
  scope: Scope | 'RequestHandler',
  tags: TagObject[],
  prefix: string = '/',
): void {
  target[REGISTRABLE] = async function (fastifyInstance: FastifyInstance) {
    let controllerInstance;
    await fastifyInstance.register(
      async (instance) => {
        controllerInstance = await ControllerTypeStrategies[scope](instance, target, metadata, tags);
      },
      { prefix },
    );
    return controllerInstance;
  };
}
