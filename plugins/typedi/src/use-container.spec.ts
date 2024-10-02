import { fastify } from 'fastify';
import { bootstrap, Controller } from 'fastify-decorators';
import { Container, Service } from 'typedi';
import { useContainer } from './index.js';
import { CLASS_LOADER } from 'fastify-decorators/plugins';

describe('Use container', () => {
  beforeAll(() => {
    useContainer(Container);
  });

  it('should create controller with injected dependency', async () => {
    const instance = fastify();
    instance.register(bootstrap, { controllers: [SampleController] });

    await instance.ready();

    expect(Container.has(SampleController)).toBeTruthy();
    expect(instance[CLASS_LOADER](SampleController, instance)).toBeInstanceOf(SampleController);
    expect((instance[CLASS_LOADER](SampleController, instance) as SampleController).dependency).toBeInstanceOf(Dependency);
  });
});

@Service()
class Dependency {}

@Controller()
class SampleController {
  constructor(public dependency: Dependency) {}
}
