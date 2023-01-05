import { CREATOR } from 'fastify-decorators/plugins';
import { InjectableService } from '../interfaces/injectable-class.js';
import { _InjectablesHolder } from '../registry/_injectables-holder.js';
import { MocksManager } from './mocks-manager.js';

describe('Testing: mocks manager', () => {
  it('should create injectables map from another one', () => {
    const injectables = new _InjectablesHolder();
    injectables.injectSingleton({}, { value: 3 }, false);

    const created = MocksManager.create(injectables);

    expect(created).toEqual(injectables);
    expect(created).not.toBe(injectables);
  });

  it('should overwrite values from original holder with providers', () => {
    const token = {};
    const injectables = new _InjectablesHolder();
    injectables.injectSingleton(token, { value: 3 });

    const created = MocksManager.create(injectables, [{ provide: token, useValue: { value: 45 } }]);

    expect((injectables.get(token) as InjectableService)[CREATOR].register((c) => new c())).toEqual({ value: 3 });
    expect((created.get(token) as InjectableService)[CREATOR].register((c) => new c())).toEqual({ value: 45 });
  });
});
