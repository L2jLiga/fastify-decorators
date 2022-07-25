/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { classLoaderFactory } from '../decorators/helpers/inject-dependencies.js';
import type { Constructor } from '../decorators/helpers/inject-dependencies.js';
import type { InjectableService } from '../interfaces/injectable-class.js';
import { injectables } from '../registry/injectables.js';
import { CREATOR } from '../symbols/index.js';

export function getInstanceByToken<Type>(token: string | symbol | Constructor<Type>): Type {
  const classLoader = classLoaderFactory(injectables, true);
  const injectable: InjectableService | undefined = injectables.get(token);
  verifyInjectable(token, injectable);

  return injectable[CREATOR].register<Type>(classLoader);
}

function verifyInjectable<Type>(
  token: string | symbol | Constructor<Type>,
  injectable: InjectableService | undefined,
): asserts injectable is InjectableService {
  if (!injectable) throw new Error(`Injectable not found for token "${token.toString()}"`);
}
