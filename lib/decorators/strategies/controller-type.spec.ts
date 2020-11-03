import { RouteShorthandOptions } from 'fastify';
import { ErrorHandler, Handler, Hook } from '../../interfaces';
import { ControllerType } from '../../registry';
import { ERROR_HANDLERS, HANDLERS, HOOKS } from '../../symbols';
import { ControllerTypeStrategies } from './controller-type';

describe('Strategies: controller types', () => {
    describe('Singleton strategy', () => {
        it('should do nothing with empty controller', () => {
            class Controller {
            }

            class Instance {
            }

            // @ts-expect-error classes implements only required methods -> ts show errors
            expect(() => ControllerTypeStrategies[ControllerType.SINGLETON](new Instance(), Controller, new Map(), false)).not.toThrow();
        });

        it('should create controller with handler', () => {
            class Controller {
                static [HANDLERS]: Handler[] = [
                    {
                        url: '/',
                        method: 'get',
                        options: {},
                        handlerMethod: 'test',
                    },
                ];

                payload = 'Message';

                test() {
                    return this.payload;
                }
            }

            class Instance {
                get(url: string, options: RouteShorthandOptions, handler: () => string) {
                    expect(url).toBe('/');
                    expect(options).toEqual({});
                    expect(handler()).toBe('Message');
                }
            }

            // @ts-expect-error classes implements only required methods -> ts show errors
            ControllerTypeStrategies[ControllerType.SINGLETON](new Instance(), Controller, new Map(), false);
        });

        it('should create controller with error handlers', () => {
            class Controller {
                static [ERROR_HANDLERS]: ErrorHandler[] = [
                    {
                        accepts<T extends Error>(): boolean {
                            return true;
                        },
                        handlerName: 'test',
                    },
                ];

                payload = 'Message';

                test() {
                    return this.payload;
                }
            }

            const instance = {
                setErrorHandler: jest.fn(),
            };

            // @ts-expect-error classes implements only required methods -> ts show errors
            ControllerTypeStrategies[ControllerType.SINGLETON](instance, Controller, new Map(), false);

            expect(instance.setErrorHandler).toHaveBeenCalled();
        });

        it('should create controller with hooks', () => {
            class Controller {
                static [HOOKS]: Hook[] = [
                    {
                        name: 'onRequest',
                        handlerName: 'test',
                    },
                ];

                payload = 'Message';

                test() {
                    return this.payload;
                }
            }

            const instance = {
                addHook: jest.fn(),
            };

            // @ts-expect-error classes implements only required methods -> ts show errors
            ControllerTypeStrategies[ControllerType.SINGLETON](instance, Controller, new Map(), false);

            expect(instance.addHook).toHaveBeenCalled();
        });
    });

    describe('Per request strategy', () => {
        it('should do nothing with empty controller', () => {
            class Controller {
            }

            class Instance {
            }

            // @ts-expect-error classes implements only required methods -> ts show errors
            expect(() => ControllerTypeStrategies[ControllerType.REQUEST](new Instance(), Controller, new Map(), false)).not.toThrow();
        });

        it('should create controller with handler', () => {
            class Controller {
                static [HANDLERS]: Handler[] = [
                    {
                        url: '/',
                        method: 'get',
                        options: {},
                        handlerMethod: 'test',
                    },
                ];
                payload = 'Message';

                test() {
                    return this.payload;
                }
            }

            class Instance {
                get(url: string, options: RouteShorthandOptions, handler: (req: unknown) => string) {
                    expect(url).toBe('/');
                    expect(options).toEqual({});
                    expect(handler({})).toEqual('Message');
                }
            }

            // @ts-expect-error classes implements only required methods -> ts show errors
            ControllerTypeStrategies[ControllerType.REQUEST](new Instance(), Controller, new Map(), false);
        });

        it('should create controller with error handlers', () => {
            class Controller {
                static [ERROR_HANDLERS]: ErrorHandler[] = [
                    {
                        accepts<T extends Error>(): boolean {
                            return true;
                        },
                        handlerName: 'test',
                    },
                ];

                payload = 'Message';

                test() {
                    return this.payload;
                }
            }

            const instance = {
                setErrorHandler: jest.fn(),
            };

            // @ts-expect-error classes implements only required methods -> ts show errors
            ControllerTypeStrategies[ControllerType.REQUEST](instance, Controller, new Map(), false);

            expect(instance.setErrorHandler).toHaveBeenCalled();
        });

        it('should create controller with hooks', () => {
            class Controller {
                static [HOOKS]: Hook[] = [
                    {
                        name: 'onRequest',
                        handlerName: 'test',
                    },
                ];

                payload = 'Message';

                test() {
                    return this.payload;
                }
            }

            const instance = {
                addHook: jest.fn(),
            };

            // @ts-expect-error classes implements only required methods -> ts show errors
            ControllerTypeStrategies[ControllerType.REQUEST](instance, Controller, new Map(), false);

            expect(instance.addHook).toHaveBeenCalled();
        });
    });
});
