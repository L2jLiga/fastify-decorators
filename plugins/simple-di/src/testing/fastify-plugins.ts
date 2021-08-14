/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyInstance, FastifyPluginAsync, FastifyPluginCallback, FastifyPluginOptions } from 'fastify';

export type Plugins = Array<
  | FastifyPluginAsync<any>
  | FastifyPluginCallback<any>
  | [plugin: FastifyPluginAsync<any>, options?: FastifyPluginOptions]
  | [plugin: FastifyPluginCallback<any>, options?: FastifyPluginOptions]
>;

export function loadPlugins(instance: FastifyInstance, plugins?: Plugins): void {
  for (const plugin of plugins ?? []) {
    if (Array.isArray(plugin)) {
      instance.register(plugin[0], plugin[1]);
    } else {
      instance.register(plugin as FastifyPluginCallback);
    }
  }
}
