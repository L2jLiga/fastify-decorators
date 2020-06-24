/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { Constructor } from '../decorators/helpers/inject-dependencies';
import { InjectableService } from '../interfaces/injectable-class';
import { injectables } from '../registry/injectables';
import { CREATOR } from '../symbols';

export function getInstanceByToken<Type>(token: string | symbol | Constructor<Type>): Type {
    const injectable: InjectableService | undefined = injectables.get(token);
    verifyInjectable(token, injectable);

    return injectable[CREATOR]
        .register<Type>(injectables);
}

function verifyInjectable<Type>(token: string | symbol | Constructor<Type>, injectable: InjectableService | undefined): asserts injectable is InjectableService {
    if (!injectable) throw new Error(`Injectable not found for token "${token.toString()}"`);
}
