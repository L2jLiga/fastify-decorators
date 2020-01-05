import { CREATOR } from '../../symbols';

interface Constructor<T> {
    new(): T;
    new(...args: any[]): T;
}

declare namespace Reflect {
    function getMetadata(metadataKey: string, target: Object): any;
}

export function createWithInjectedDependencies<C>(constructor: Constructor<C>): C {
    if (typeof Reflect.getMetadata !== 'function') return new constructor();

    const args: any[] = Reflect.getMetadata('design:paramtypes', constructor)
        ?.map((value: any) => value[CREATOR].register()) ?? [];

    return new constructor(...args);
}
