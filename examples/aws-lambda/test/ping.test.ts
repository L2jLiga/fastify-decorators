import { handler } from '../src/index.js';

describe('AWS Lambda: PingController', function () {
  it('should reply with ok on ping/async', async () => {
    const event = {
      requestContext: { http: { method: 'GET' } },
      rawPath: '/ping/async',
      headers: { 'transfer-encoding': 'chunked' },
      queryStringParameters: '',
    };
    const context = {};

    const response = await handler(event, context);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe('{"message":"ok"}');
  });

  it('should reply with ok on ping/sync', async () => {
    const event = {
      requestContext: { http: { method: 'GET' } },
      rawPath: '/ping/sync',
      headers: { 'transfer-encoding': 'chunked' },
      queryStringParameters: '',
    };
    const context = {};

    const response = await handler(event, context);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe('{"message":"ok"}');
  });
});
