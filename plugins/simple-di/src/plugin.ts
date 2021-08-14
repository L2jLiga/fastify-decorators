import { createInitializationHook } from 'fastify-decorators/plugins';
import { readyMap } from './decorators/initializer.js';

export function registerPlugin(): void {
  createInitializationHook<'appReady'>('appReady', () => Promise.all(readyMap.values()));
}
