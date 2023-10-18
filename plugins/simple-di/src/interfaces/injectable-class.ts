/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { ClassLoader, Constructable, CREATOR, Scope } from 'fastify-decorators/plugins';
import { DESTRUCTOR, INITIALIZER } from '../symbols.js';

export interface InjectableService<T = unknown> extends Constructable<T> {
  [CREATOR]: {
    register<Type>(classLoader: ClassLoader, scope: Scope): Type;
  };

  [INITIALIZER]?<Type>(self: Type): void;

  [DESTRUCTOR]?: string | symbol;
}
