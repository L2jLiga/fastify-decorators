import { app } from '../../src/app.js';
import { ErrorType } from '../../src/error-handling/error-type.js';
import chai from 'chai';

/* eslint-disable jest/valid-expect */
const { expect } = chai;

describe('Controllers error handling tests', () => {
  describe('Stateful controller error handling support', () => {
    it('should trigger generic error handler', async () => {
      const initialState = await app.inject({
        url: '/stateful/error-handling',
        query: {
          errorType: ErrorType.GENERIC.toString(),
        },
      });

      expect(initialState.statusCode).to.equal(500);
    });

    it('should trigger syntax error handler', async () => {
      const initialState = await app.inject({
        url: '/stateful/error-handling',
        query: {
          errorType: ErrorType.SYNTAX.toString(),
        },
      });

      expect(initialState.statusCode).to.equal(501);
    });

    it('should trigger type error handler', async () => {
      const initialState = await app.inject({
        url: '/stateful/error-handling',
        query: {
          errorType: ErrorType.TYPE.toString(),
        },
      });

      expect(initialState.statusCode).to.equal(502);
    });

    it('should trigger custom error handler', async () => {
      const initialState = await app.inject({
        url: '/stateful/error-handling',
        query: {
          errorType: ErrorType.CUSTOM.toString(),
        },
      });

      expect(initialState.statusCode).to.equal(503);
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

      expect(initialState.statusCode).to.equal(500);
    });

    it('should trigger syntax error handler', async () => {
      const initialState = await app.inject({
        url: '/stateless/error-handling',
        query: {
          errorType: ErrorType.SYNTAX.toString(),
        },
      });

      expect(initialState.statusCode).to.equal(501);
    });

    it('should trigger type error handler', async () => {
      const initialState = await app.inject({
        url: '/stateless/error-handling',
        query: {
          errorType: ErrorType.TYPE.toString(),
        },
      });

      expect(initialState.statusCode).to.equal(502);
    });

    it('should trigger custom error handler', async () => {
      const initialState = await app.inject({
        url: '/stateless/error-handling',
        query: {
          errorType: ErrorType.CUSTOM.toString(),
        },
      });

      expect(initialState.statusCode).to.equal(503);
    });
  });
});
