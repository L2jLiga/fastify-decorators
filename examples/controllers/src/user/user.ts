export const users = new Set<string>();

export const schema = {
  response: {
    200: {
      type: 'object',
      properties: { username: { type: 'string' } },
    },
  },
};
