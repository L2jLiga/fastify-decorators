/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { FastifyInstance, FastifyPluginAsync, FastifyPluginCallback, FastifyPluginOptions } from 'fastify';

// TODO: Check for better solution
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Plugin = FastifyPluginAsync<any, any, any, any> | FastifyPluginCallback<any, any, any, any>;
export type PluginWithOptions = [plugin: Plugin, options: FastifyPluginOptions];

export type Plugins = Array<Plugin | PluginWithOptions>;

function getArray(plugin: Plugin | PluginWithOptions): plugin is PluginWithOptions {
  return Array.isArray(plugin);
}

export function loadPlugins(instance: FastifyInstance, plugins?: Plugins): void {
  for (const plugin of plugins ?? ([] as Plugins)) {
    if (getArray(plugin)) {
      instance.register(plugin[0], plugin[1]);
    } else {
      instance.register(plugin);
    }
  }
}
