/* eslint-disable jest/no-standalone-expect,jest/expect-expect */
import { FastifyRequest, RouteShorthandOptions } from 'fastify';
import { Hook } from '../../interfaces';
import { CREATOR, HOOKS } from '../../symbols';
import { requestDecoratorsFactory } from './request-decorators.factory';

describe('Factory: request decorators', () => {
    const factory = requestDecoratorsFactory('get');

    class Instance {
        constructor(private url: string, private options: RouteShorthandOptions) {
        }

        get(url: string, options: RouteShorthandOptions) {
            expect(url).toEqual(this.url);
            expect(options).toEqual(this.options);
        }
    }

    it('should parse empty config', () => {
        class Handler {}

        const instance = new Instance('/', {});
        const decorate = factory();

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);
    });

    it('should parse config with URL only', () => {
        class Handler {}

        const instance = new Instance('/url', {});
        const decorate = factory('/url');

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);
    });

    it('should parse config with URL and options', () => {
        class Handler {}

        const instance = new Instance('/url', { schema: { body: { type: 'string' } } });
        const decorate = factory('/url', { schema: { body: { type: 'string' } } });

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);
    });

    it('should parse route config', () => {
        class Handler {}

        const instance = new Instance('/url', { schema: { body: { type: 'string' } } });
        const decorate = factory({ url: '/url', options: { schema: { body: { type: 'string' } } } });

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);
    });
});
