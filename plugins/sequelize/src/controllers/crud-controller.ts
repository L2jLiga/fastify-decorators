/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { addHandler, decorateController } from 'fastify-decorators/plugins';
import { Model } from 'sequelize';
import { entityMetadataMapper } from '../mappers/entity-to-json-schema';
import { crudHandlersConfiguration, crudHandlersFactory } from './crud-handlers-factory';

// eslint-disable-next-line @typescript-eslint/ban-types
export function CrudController<Entity extends typeof Model>(entity: Entity, route = `/${entity.name}`): ClassDecorator {
  return decorateController(route, (target, instance) => {
    if (!instance.hasDecorator('sequelize'))
      throw new Error('"sequelize" not found, did you decorate FastifyInstance with it?');

    const entitySchema = entityMetadataMapper(instance, entity);

    Object.defineProperties(target.prototype, crudHandlersFactory(entitySchema));

    crudHandlersConfiguration(entitySchema).forEach((handler) => addHandler(target, handler));
  });
}
