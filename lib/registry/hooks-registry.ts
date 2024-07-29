import { AfterControllerCreationHook, AppDestroyHook, AppInitHook, AppReadyHook, BeforeControllerCreationHook } from '../plugins/life-cycle.js';

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
