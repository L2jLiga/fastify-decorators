import { ErrorHandler, Hook } from '../../interfaces';
import { CREATOR, ERROR_HANDLERS, HOOKS } from '../../symbols';
import { requestDecoratorsFactory } from './request-decorators.factory';
import { RouteShorthandOptions } from 'fastify';

describe('Factory: request decorators', () => {
    const factory = requestDecoratorsFactory('get');

    it('should parse empty config', () => {
        class Handler {
        }

        const instance = { get: jest.fn() };
        const decorate = factory();

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);

        expect(instance.get).toHaveBeenCalledWith('/', <RouteShorthandOptions>{}, expect.any(Function));
    });

    it('should parse config with URL only', () => {
        class Handler {
        }

        const instance = { get: jest.fn() };
        const decorate = factory('/url');

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);

        expect(instance.get).toHaveBeenCalledWith('/url', <RouteShorthandOptions>{}, expect.any(Function));
    });

    it('should parse config with URL and options', () => {
        class Handler {
        }

        const instance = { get: jest.fn() };
        const decorate = factory('/url', <RouteShorthandOptions>{ schema: { body: { type: 'string' } } });

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);

        expect(instance.get).toHaveBeenCalledWith('/url', <RouteShorthandOptions>{ schema: { body: { type: 'string' } } }, expect.any(Function));
    });

    it('should parse route config', () => {
        class Handler {
        }

        const instance = { get: jest.fn() };
        const decorate = factory({
            url: '/url',
            options: <RouteShorthandOptions>{ schema: { body: { type: 'string' } } },
        });

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);

        expect(instance.get).toHaveBeenCalledWith('/url', <RouteShorthandOptions>{ schema: { body: { type: 'string' } } }, expect.any(Function));
    });

    it('should add hooks to options', () => {
        class Handler {
            static [HOOKS]: Hook[] = [
                {
                    name: 'onSend',
                    handlerName: 'onSendFn',
                },
            ];
        }

        const instance = { get: jest.fn(), addHook: jest.fn() };
        const decorate = factory({
            url: '/url',
            options: <RouteShorthandOptions>{ schema: { body: { type: 'string' } } },
        });

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);

        expect(instance.get).toHaveBeenCalledWith('/url', <RouteShorthandOptions>{
            onSend: expect.any(Function),
            schema: { body: { type: 'string' } },
        }, expect.any(Function));
    });

    it('should add error handlers to options', () => {
        class Handler {
            static [ERROR_HANDLERS]: ErrorHandler[] = [
                {
                    accepts: jest.fn(),
                    handlerName: 'onSendFn',
                },
            ];
        }

        const instance = { get: jest.fn(), addHook: jest.fn() };
        const decorate = factory({
            url: '/url',
            options: <RouteShorthandOptions>{ schema: { body: { type: 'string' } } },
        });

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);

        expect(instance.get).toHaveBeenCalledWith('/url', <RouteShorthandOptions>{
            errorHandler: expect.any(Function),
            schema: { body: { type: 'string' } },
        }, expect.any(Function));
    });
});
