import { FastifyInstance } from 'fastify';
import { ControllerConstructor } from '../../interfaces';
import { ControllerType } from '../../registry';
import { CONTROLLER } from '../../symbols';

export const ControllerTypeStrategies = {
    [ControllerType.SINGLETON](instance: FastifyInstance, controllerConstructor: ControllerConstructor) {
        const controllerInstance = new controllerConstructor;
        const configuration = controllerConstructor[CONTROLLER];

        configuration.handlers.forEach(handler => {
            instance[handler.method](handler.url, handler.options, (request, reply) => controllerInstance[handler.handlerMethod](request, reply));
        });

        configuration.hooks.forEach(hook => {
            instance.addHook(hook.name, controllerInstance[hook.handlerName].bind(controllerInstance));
        });
    },

    [ControllerType.REQUEST](instance: FastifyInstance, controllerConstructor: ControllerConstructor) {
        const configuration = controllerConstructor[CONTROLLER];

        configuration.handlers.forEach(handler => {
            instance[handler.method](handler.url, handler.options, (request, reply) => (new controllerConstructor)[handler.handlerMethod](request, reply));
        });

        configuration.hooks.forEach(hook => {
            const controllerInstance = new controllerConstructor;

            instance.addHook(hook.name, controllerInstance[hook.handlerName].bind(controllerInstance));
        });
    }
};