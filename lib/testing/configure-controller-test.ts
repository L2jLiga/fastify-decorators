import fastify = require('fastify');
import { injectables } from '../registry/injectables';
import { CREATOR } from '../symbols';
import { wrapInjectable } from '../utils/wrap-injectable';

export interface ServiceMock {
    provide: any;
    useValue: any;
}

export interface ControllerTestConfig {
    controller: any;
    mocks?: ServiceMock[];
}

export async function configureControllerTest(config: ControllerTestConfig) {
    const instance = fastify();
    const mocks: ServiceMock[] = config.mocks ?? [];

    const mockedInjectables: Array<[any, any]> = [];
    for (const [key, value] of injectables.entries()) {
        const mock = mocks.find(({ provide }) => provide === value);

        if (mock) mockedInjectables.push([key, wrapInjectable(mock.useValue)])
        else mockedInjectables.push([key, value]);
    }

    config.controller[CREATOR].register(instance, new Map(mockedInjectables), false);

    return instance;
}
