import 'reflect-metadata';

import { CREATOR } from 'fastify-decorators/plugins';
import { INITIALIZER } from '../symbols.js';
import { getInstanceByToken } from '../utils/get-instance-by-token.js';
import { Service } from './service.js';
import { jest } from '@jest/globals';

describe('Decorators: @Service', () => {
  it('should add CREATOR static property to class', () => {
    @Service()
    class Srv {}

    // @ts-expect-error TypeScript does not know about patches within decorator
    expect(Srv[CREATOR]).toBeTruthy();
  });

  it('should create service', () => {
    @Service()
    class Srv {}

    // @ts-expect-error TypeScript does not know about patches within decorator
    const instance = Srv[CREATOR].register();

    expect(instance).toBeDefined();
  });

  it('should call initializer when instantiate service', () => {
    @Service()
    class Srv {
      static [INITIALIZER] = jest.fn((srv: unknown) => {
        expect(srv).toBeInstanceOf(Srv);
      });
    }

    // @ts-expect-error TypeScript does not know about patches within decorator
    Srv[CREATOR].register();

    expect(Srv[INITIALIZER]).toHaveBeenCalled();
  });

  it('should return same instance if service created multiple times', () => {
    @Service()
    class Srv {}

    // @ts-expect-error TypeScript does not know about patches within decorator
    const instance1 = Srv[CREATOR].register();
    // @ts-expect-error TypeScript does not know about patches within decorator
    const instance2 = Srv[CREATOR].register();
    // @ts-expect-error TypeScript does not know about patches within decorator
    const instance3 = Srv[CREATOR].register();

    expect(instance1).toBe(instance2);
    expect(instance1).toBe(instance3);
    expect(instance2).toBe(instance3);
  });

  it('should register service by injectable token and class', () => {
    @Service('token')
    class Srv {}

    const instanceByClass = getInstanceByToken(Srv);
    const instanceByToken = getInstanceByToken('token');

    expect(instanceByClass).toBeInstanceOf(Srv);
    expect(instanceByToken).toBeInstanceOf(Srv);
  });
});
