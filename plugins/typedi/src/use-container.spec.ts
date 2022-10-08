import { FastifyInstance } from 'fastify';
import { hooksRegistry, Registrable } from 'fastify-decorators/plugins';
import { Container } from 'typedi';
import { useContainer } from './index.js';

describe('Use container', () => {
  beforeEach(() => {
    hooksRegistry.beforeControllerCreation = [];
    hooksRegistry.afterControllerCreation = [];
    Container.reset();
  });

  it('should register before controller creation hook', () => {
    useContainer(Container);

    expect(hooksRegistry.beforeControllerCreation).toHaveLength(1);
  });

  it('should register controller in container on beforeControllerCreation', () => {
    useContainer(Container);

    class Test {}

    hooksRegistry.beforeControllerCreation[0]({} as FastifyInstance, Test as Registrable);

    expect(Container.get(Test)).toBeInstanceOf(Test);
  });

  it('should register after controller creation hook', () => {
    useContainer(Container);

    expect(hooksRegistry.afterControllerCreation).toHaveLength(1);
  });
});
