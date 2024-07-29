import { FastifyInstance } from 'fastify';
import { Registrable } from './shared-interfaces.js';
import { HooksRegistry, hooksRegistry } from '../registry/hooks-registry.js';

/**
 * Hook that executed when Fastify starts
 * fastify-decorators loading
 */
export type AppInitHook = (fastifyInstance: FastifyInstance) => unknown | Promise<unknown>;

/**
 * Hooks that executed before each controller
 * class instantiation.
 */
export type BeforeControllerCreationHook = (fastifyInstance: FastifyInstance, target: Registrable) => unknown | Promise<unknown>;

/**
 * Hooks that executed after each controller
 * class were instantiated.
 */
export type AfterControllerCreationHook = (fastifyInstance: FastifyInstance, target: Registrable, instance: unknown) => unknown | Promise<unknown>;

/**
 * Hooks that executed when all controllers
 * are instantiated.
 */
export type AppReadyHook = (fastifyInstance: FastifyInstance) => unknown | Promise<unknown>;

/**
 * Hooks that executed when fastify instance
 * is going to close
 */
export type AppDestroyHook = (fastifyInstance: FastifyInstance) => unknown | Promise<unknown>;

/**
 * Helper function for hooking fastify-decorators,
 * see overloads and hooks description.
 */
export function createInitializationHook<T extends 'appInit'>(stage: T, hookFn: AppInitHook): void;
export function createInitializationHook<T extends 'beforeControllerCreation'>(stage: T, hookFn: BeforeControllerCreationHook): void;
export function createInitializationHook<T extends 'afterControllerCreation'>(stage: T, hookFn: AfterControllerCreationHook): void;
export function createInitializationHook<T extends 'appReady'>(stage: T, hookFn: AppReadyHook): void;
export function createInitializationHook<T extends 'appDestroy'>(stage: T, hookFn: AppDestroyHook): void;
export function createInitializationHook<T extends keyof HooksRegistry>(stage: T, hookFn: HooksRegistry[T][0]): void {
  hooksRegistry[stage].push(hookFn as () => unknown);
}
