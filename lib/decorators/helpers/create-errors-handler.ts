/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ErrorHandler } from '../../interfaces';

export function createErrorsHandler(
    errorHandlers: ErrorHandler[], classInstance: any,
): (error: Error, request: FastifyRequest, reply: FastifyReply) => Promise<void> {
    return async function errorHandler(error: Error, request: FastifyRequest, reply: FastifyReply): Promise<void> {
        for (const handler of errorHandlers) {
            if (handler.accepts(error)) {
                try {
                    await classInstance[handler.handlerName](error, request, reply);
                    return;
                } catch (e) {
                    error = e;
                }
            }
        }

        throw error;
    };
}
