/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { Constructable, CREATOR } from 'fastify-decorators/plugins';
import { INITIALIZER, INJECTABLES } from '../symbols.js';

export type Injectables = Map<string | symbol | unknown, InjectableService>;

export interface InjectableService extends Object, Constructable<any> {
  [CREATOR]: {
    register<Type>(injectables?: Injectables, cacheResult?: boolean): Type;
  };
  [INJECTABLES]: Injectables;

  [INITIALIZER]?<Type>(self: Type): void;
}
