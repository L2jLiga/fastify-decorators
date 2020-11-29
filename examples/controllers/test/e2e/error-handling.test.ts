import { app } from '../../src';
import { ErrorType } from '../../src/error-handling/error-type';

describe('Controllers error handling tests', () => {
  describe('Stateful controller error handling support', () => {
    it('should trigger generic error handler', async () => {
      const initialState = await app.inject({
        url: '/stateful/error-handling',
        query: {
          errorType: ErrorType.GENERIC.toString(),
        },
      });

      expect(initialState.statusCode).toEqual(500);
    });

    it('should trigger syntax error handler', async () => {
      const initialState = await app.inject({
        url: '/stateful/error-handling',
        query: {
          errorType: ErrorType.SYNTAX.toString(),
        },
      });

      expect(initialState.statusCode).toEqual(501);
    });

    it('should trigger type error handler', async () => {
      const initialState = await app.inject({
        url: '/stateful/error-handling',
        query: {
          errorType: ErrorType.TYPE.toString(),
        },
      });

      expect(initialState.statusCode).toEqual(502);
    });

    it('should trigger custom error handler', async () => {
      const initialState = await app.inject({
        url: '/stateful/error-handling',
        query: {
          errorType: ErrorType.CUSTOM.toString(),
        },
      });

      expect(initialState.statusCode).toEqual(503);
    });
  });

  describe('Stateless controller error handling support', () => {
    it('should trigger generic error handler', async () => {
      const initialState = await app.inject({
        url: '/stateless/error-handling',
        query: {
          errorType: ErrorType.GENERIC.toString(),
        },
      });

      expect(initialState.statusCode).toEqual(500);
    });

    it('should trigger syntax error handler', async () => {
      const initialState = await app.inject({
        url: '/stateless/error-handling',
        query: {
          errorType: ErrorType.SYNTAX.toString(),
        },
      });

      expect(initialState.statusCode).toEqual(501);
    });

    it('should trigger type error handler', async () => {
      const initialState = await app.inject({
        url: '/stateless/error-handling',
        query: {
          errorType: ErrorType.TYPE.toString(),
        },
      });

      expect(initialState.statusCode).toEqual(502);
    });

    it('should trigger custom error handler', async () => {
      const initialState = await app.inject({
        url: '/stateless/error-handling',
        query: {
          errorType: ErrorType.CUSTOM.toString(),
        },
      });

      expect(initialState.statusCode).toEqual(503);
    });
  });
});
