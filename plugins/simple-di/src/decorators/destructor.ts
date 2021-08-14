import { createInitializationHook } from 'fastify-decorators/plugins';
import { getInstanceByToken } from '../utils/get-instance-by-token.js';

export const servicesWithDestructors = new Map();

createInitializationHook('appDestroy', () =>
  Promise.all([...servicesWithDestructors].map(([Service, property]) => getInstanceByToken<typeof Service>(Service)[property]())),
);

export function Destructor(): PropertyDecorator {
  return (target: any, propertyKey: string | symbol): void => {
    servicesWithDestructors.set(target.constructor, propertyKey);
  };
}
