/// <reference types="fastify-oas" />
import { Static, Type } from '@sinclair/typebox';
import { FastifySchema, RouteSchema } from 'fastify';

const body = Type.Object({
    message: Type.String(),
});
const response = Type.Object({
    message: Type.String(),
});

export type TBody = Static<typeof body>;
export const schema: FastifySchema & RouteSchema = {
    tags: ['Typed Controller', 'Swagger example'],
    body,
    response: {
        200: response,
    },
};
