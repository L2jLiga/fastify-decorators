/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { Constructable, CREATOR } from 'fastify-decorators/plugins';
import type { InjectableService } from '../interfaces/injectable-class.js';
import { injectables } from '../registry/injectables.js';

export function getInstanceByToken<Type>(token: string | symbol | Constructable<Type>): Type {
  const injectable: InjectableService | undefined = injectables.get(token);
  verifyInjectable(token, injectable);

  return injectable[CREATOR].register<Type>(injectables);
}

function verifyInjectable<Type>(
  token: string | symbol | Constructable<Type>,
  injectable: InjectableService | undefined,
): asserts injectable is InjectableService {
  if (!injectable) throw new Error(`Injectable not found for token "${token.toString()}"`);
}
