import { CREATOR } from '../../symbols';

export type Constructor<T> = { new(): T } | { new(...args: any): T }

declare namespace Reflect {
    function getMetadata(metadataKey: string, target: Object): any;
}

export function createWithInjectedDependencies<C>(constructor: Constructor<C>, injectables: Map<any, any>, cacheResult: boolean): C {
    if (typeof Reflect.getMetadata !== 'function') return new constructor();

    const args: any[] = Reflect.getMetadata('design:paramtypes', constructor)
        ?.map((value: any) => injectables.get(value))
        ?.map((value: any) => {
            if (value) return value[CREATOR].register(injectables, cacheResult);
            throw new TypeError('Invalid arguments provided. Expected class annotated with @Service.');
        }) ?? [];

    return new constructor(...args);
}
