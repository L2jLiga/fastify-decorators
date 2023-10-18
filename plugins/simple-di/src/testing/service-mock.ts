/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */
import { Constructable } from 'fastify-decorators/plugins';

export interface ServiceMock<T = unknown> {
  provide: string | symbol | Record<string | symbol | number, unknown> | Constructable<T>;
  useValue: Record<string | symbol | number, unknown>;
}
