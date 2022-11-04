import { _InjectablesHolder } from '../registry/_injectables-holder.js';
import { MocksManager } from './mocks-manager.js';

describe('Testing: mocks manager', () => {
  it('should create injectables map from another one', () => {
    const injectables = new _InjectablesHolder();

    const created = MocksManager.create(injectables);

    expect(created).toEqual(injectables);
    expect(created).not.toBe(injectables);
  });
});
