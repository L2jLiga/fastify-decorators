/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { TagObject } from '../decorators/helpers/swagger-helper.js';
import type { ControllerType } from '../registry/controller-type.js';

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

  /**
   * List of tags to group endpoints in swagger
   *
   * by default this list is empty, adding tags here will add same tags to all methods inside controller.
   * In case if method has own set of tags they will have higher priority instead of controller tags
   */
  tags?: TagObject[];
}
