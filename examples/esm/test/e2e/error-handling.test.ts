import { strictEqual } from 'assert';
import { app } from '../../src/app.js';
import { ErrorType } from '../../src/error-handling/error-type.js';

describe('Controllers error handling tests', () => {
  describe('Stateful controller error handling support', () => {
    it('should trigger generic error handler', async () => {
      const initialState = await app.inject({
        url: '/stateful/error-handling',
        query: {
          errorType: ErrorType.GENERIC.toString(),
        },
      });

      strictEqual(initialState.statusCode, 500);
    });

    it('should trigger syntax error handler', async () => {
      const initialState = await app.inject({
        url: '/stateful/error-handling',
        query: {
          errorType: ErrorType.SYNTAX.toString(),
        },
      });

      strictEqual(initialState.statusCode, 501);
    });

    it('should trigger type error handler', async () => {
      const initialState = await app.inject({
        url: '/stateful/error-handling',
        query: {
          errorType: ErrorType.TYPE.toString(),
        },
      });

      strictEqual(initialState.statusCode, 502);
    });

    it('should trigger custom error handler', async () => {
      const initialState = await app.inject({
        url: '/stateful/error-handling',
        query: {
          errorType: ErrorType.CUSTOM.toString(),
        },
      });

      strictEqual(initialState.statusCode, 503);
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

      strictEqual(initialState.statusCode, 500);
    });

    it('should trigger syntax error handler', async () => {
      const initialState = await app.inject({
        url: '/stateless/error-handling',
        query: {
          errorType: ErrorType.SYNTAX.toString(),
        },
      });

      strictEqual(initialState.statusCode, 501);
    });

    it('should trigger type error handler', async () => {
      const initialState = await app.inject({
        url: '/stateless/error-handling',
        query: {
          errorType: ErrorType.TYPE.toString(),
        },
      });

      strictEqual(initialState.statusCode, 502);
    });

    it('should trigger custom error handler', async () => {
      const initialState = await app.inject({
        url: '/stateless/error-handling',
        query: {
          errorType: ErrorType.CUSTOM.toString(),
        },
      });

      strictEqual(initialState.statusCode, 503);
    });
  });
});
