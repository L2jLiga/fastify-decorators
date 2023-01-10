/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { ClassLoader, CREATOR, Scope } from 'fastify-decorators/plugins';
import { InjectableService } from '../interfaces/injectable-class.js';
import { _injectablesHolder } from '../registry/_injectables-holder.js';
import { destructors } from '../registry/destructors.js';
import { DESTRUCTOR, INITIALIZER } from '../symbols.js';

const INITIALIZED = Symbol.for('fastify-decorators.initializer-called');

/**
 * Decorator for making classes injectable
 */
export function Service(): ClassDecorator;
export function Service(injectableToken: string | symbol): ClassDecorator;
export function Service(injectableToken?: string | symbol): unknown {
  return (target: InjectableService) => {
    target[CREATOR] = {
      register<Type>(classLoader: ClassLoader, scope: Scope): Type {
        if ('context' in scope) scope = scope.server;
        const instance = classLoader<Type & { [INITIALIZED]?: Promise<unknown> }>(target, scope);
        if (instance[INITIALIZED]) return instance as Type;

        instance[INITIALIZED] = Promise.resolve(target[INITIALIZER]?.(instance));
        // @ts-expect-error TODO: make this work without expect-error
        if (target[DESTRUCTOR]) destructors.set(target, () => instance[target[DESTRUCTOR]]());

        return instance as Type;
      },
    };

    _injectablesHolder.injectService(target, target, false);
    if (injectableToken) _injectablesHolder.injectService(injectableToken, target, false);
  };
}
