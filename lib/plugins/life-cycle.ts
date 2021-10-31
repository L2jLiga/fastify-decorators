import { FastifyInstance } from 'fastify';
import { Registrable } from './shared-interfaces.js';

export type AppInitHook = (fastifyInstance: FastifyInstance) => unknown | Promise<unknown>;
export type BeforeControllerCreationHook = (target: Registrable) => unknown | Promise<unknown>;
export type AfterControllerCreationHook = (instance: unknown, target: Registrable) => unknown | Promise<unknown>;
export type AppReadyHook = (fastifyInstance: FastifyInstance) => unknown | Promise<unknown>;
export type AppDestroyHook = (fastifyInstance: FastifyInstance) => unknown | Promise<unknown>;

export interface HooksRegistry {
  appInit: AppInitHook[];
  beforeControllerCreation: BeforeControllerCreationHook[];
  afterControllerCreation: AfterControllerCreationHook[];
  appReady: AppReadyHook[];
  appDestroy: AppDestroyHook[];
}

export const hooksRegistry: HooksRegistry = {
  appInit: [],
  beforeControllerCreation: [],
  afterControllerCreation: [],
  appReady: [],
  appDestroy: [],
};

export function createInitializationHook<T extends 'appInit'>(stage: T, hookFn: AppInitHook): void;
export function createInitializationHook<T extends 'beforeControllerCreation'>(stage: T, hookFn: BeforeControllerCreationHook): void;
export function createInitializationHook<T extends 'afterControllerCreation'>(stage: T, hookFn: AfterControllerCreationHook): void;
export function createInitializationHook<T extends 'appReady'>(stage: T, hookFn: AppReadyHook): void;
export function createInitializationHook<T extends 'appDestroy'>(stage: T, hookFn: AppDestroyHook): void;
export function createInitializationHook<T extends keyof HooksRegistry>(
  stage: T,
  hookFn: T extends 'appInit'
    ? AppInitHook
    : T extends 'beforeControllerCreation'
    ? BeforeControllerCreationHook
    : T extends 'afterControllerCreation'
    ? AfterControllerCreationHook
    : T extends 'appReady'
    ? AppReadyHook
    : T extends 'appDestroy'
    ? AppDestroyHook
    : never,
): void {
  hooksRegistry[stage].push(hookFn as () => unknown);
}
