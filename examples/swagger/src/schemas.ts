/// <reference types="fastify-swagger" />
import { Static, Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';

const body = Type.Object({
  message: Type.String(),
});
const response = Type.Object({
  message: Type.String(),
});

export type TBody = Static<typeof body>;
export const schema: FastifySchema = {
  tags: ['Typed Controller', 'Swagger example'],
  body: Type.Strict(body),
  response: {
    200: Type.Strict(response),
  },
};
