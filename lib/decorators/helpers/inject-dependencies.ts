/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { Injectables, InjectableService } from '../../interfaces/injectable-class';
import { CREATOR } from '../../symbols';

export type Constructor<T> = { new(): T } | { new(...args: any): T };

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Reflect {
    function getMetadata(metadataKey: string, target: unknown): unknown[];
}

export function createWithInjectedDependencies<C>(constructor: Constructor<C>, injectables: Injectables, cacheResult: boolean): C {
    if (typeof Reflect.getMetadata !== 'function') return new constructor();

    const args: unknown[] = Reflect.getMetadata('design:paramtypes', constructor)
        ?.map((value: unknown) => injectables.get(value))
        ?.map((value: InjectableService | undefined) => {
            if (value) return value[CREATOR].register(injectables, cacheResult);
            throw new TypeError('Invalid arguments provided. Expected class annotated with @Service.');
        }) ?? [];

    return new constructor(...args);
}
