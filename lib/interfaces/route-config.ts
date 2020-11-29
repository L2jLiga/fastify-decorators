/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { RouteShorthandOptions } from 'fastify';

/**
 * Common config for all route handlers
 */
export interface RouteConfig {
  /**
   * Route url which will be passed to Fastify
   */
  url: string;

  /**
   * Route options which will be passed to Fastify
   */
  options?: RouteShorthandOptions;
}
