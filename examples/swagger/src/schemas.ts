import { Static, Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';

const body = Type.Object({
  message: Type.String(),
});
const response = Type.Object({
  message: Type.String(),
});

export type TBody = Static<typeof body>;
export const schema: FastifySchema & { tags: string[] } = {
  tags: ['Typed Controller', 'Swagger example'],
  body,
  response: {
    200: response,
  },
};
