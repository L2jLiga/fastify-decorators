/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { CREATOR } from '../symbols';
import { wrapInjectable } from './wrap-injectable';

describe('Utils: wrap into injectable', () => {
  it('should wrap object into injectable construction', () => {
    const object = {};

    const result = wrapInjectable(object)[CREATOR].register();

    expect(result).toBe(object);
  });
});
