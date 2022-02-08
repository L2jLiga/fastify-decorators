/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

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
