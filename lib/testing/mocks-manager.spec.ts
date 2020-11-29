import { Injectables } from '../interfaces/injectable-class';
import { wrapInjectable } from '../utils/wrap-injectable';
import { MocksManager } from './mocks-manager';

describe('Testing: mocks manager', () => {
  it('should create injectables map from another one', () => {
    const injectables: Injectables = new Map([['a', wrapInjectable({})]]);

    const created = MocksManager.create(injectables);

    expect(created).toEqual(injectables);
    expect(created).not.toBe(injectables);
  });
});
