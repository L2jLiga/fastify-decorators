import { Static, Type } from '@sinclair/typebox';
import { RouteSchema,FastifySchema } from 'fastify';

const body = Type.Object({
    message: Type.String()
});
const response = Type.Object({
    message: Type.String()
})

export type TBody = Static<typeof body>;
export const schema: FastifySchema & RouteSchema = {
    body,
    response: {
        200: response
    }
}
