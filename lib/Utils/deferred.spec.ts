import { Deferred } from './deferred.js';

describe('Utils: deferred', () => {
  it('should be able to resolve promise', () => {
    const deferred = new Deferred();

    deferred.resolve();

    return expect(deferred.promise).resolves.toBeUndefined();
  });

  it('should be able to reject promise', () => {
    const deferred = new Deferred();

    deferred.reject();

    return expect(deferred.promise).rejects.toBeUndefined();
  });
});
