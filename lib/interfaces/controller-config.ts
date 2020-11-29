/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { ControllerType } from '../registry';

/**
 * Config for controllers
 */
export interface ControllerConfig {
  /**
   * Controller base route
   */
  route: string;

  /**
   * Controller type
   */
  type?: ControllerType;
}
