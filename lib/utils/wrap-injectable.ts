/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { InjectableService } from '../interfaces/injectable-class';
import { CREATOR } from '../symbols';

export function wrapInjectable<T>(object: T): InjectableService {
    return <InjectableService><unknown>{
        [CREATOR]: {
            register() {
                return object;
            },
        },
    };
}
