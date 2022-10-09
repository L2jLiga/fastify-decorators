import { AddressInfo } from 'net';
import { app } from '../../src/index.js';
import { ErrorType } from '../../src/error-handling/error-type.js';
import { fetch } from 'undici';

describe('Controllers error handling tests', () => {
  beforeAll(() => app.listen());
  afterAll(() => app.close());

  const getAppOrigin = () => `http://localhost:${(app.server.address() as AddressInfo).port}`;

  for (const type of ['Stateful', 'Stateless']) {
    describe(`${type} controller error handling support`, () => {
      it('should trigger generic error handler', async () => {
        const response = await fetch(`${getAppOrigin()}/${type.toLowerCase()}/error-handling?errorType=${ErrorType.GENERIC}`);

        expect(response.status).toEqual(500);
      });

      it('should trigger syntax error handler', async () => {
        const response = await fetch(`${getAppOrigin()}/${type.toLowerCase()}/error-handling?errorType=${ErrorType.SYNTAX}`);

        expect(response.status).toEqual(501);
      });

      it('should trigger type error handler', async () => {
        const response = await fetch(`${getAppOrigin()}/${type.toLowerCase()}/error-handling?errorType=${ErrorType.TYPE}`);

        expect(response.status).toEqual(502);
      });

      it('should trigger custom error handler', async () => {
        const response = await fetch(`${getAppOrigin()}/${type.toLowerCase()}/error-handling?errorType=${ErrorType.CUSTOM}`);

        expect(response.status).toEqual(503);
      });
    });
  }
});
