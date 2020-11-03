/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyInstance } from 'fastify';
import type { CREATOR, INJECTABLES } from '../symbols';

export type Injectables = Map<string | symbol | unknown, InjectableService>;

export interface InjectableService extends InjectableClass, Object {
    [CREATOR]: {
        register<Type>(injectables?: Injectables, cacheResult?: boolean): Type
    }
}

export interface InjectableController extends InjectableClass {
    [CREATOR]: {
        register(instance?: FastifyInstance, injectables?: Injectables, cacheResult?: boolean): Promise<void>
    }
}

export interface InjectableClass {
    new(): any;

    new(...args: unknown[]): any;

    [INJECTABLES]: Injectables;
}
