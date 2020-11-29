export const messageSchema = {
  type: 'object',
  properties: {
    id: { type: 'number', nullable: false },
    author: { type: 'string', nullable: false },
    text: { type: 'string', nullable: false },
  },
};

export const messageInputSchema = {
  type: 'object',
  properties: {
    author: { type: 'string', nullable: false },
    text: { type: 'string', nullable: false },
  },
};
