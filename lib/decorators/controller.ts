import { classDecoratorFactory } from './interop/class-decorator.js';
import { makeRegistrable } from './helpers/registrable.js';
import { Scope } from '../constants/scope.js';
import { TagObject } from './helpers/swagger-helper.js';

/**
 * Controller configuration
 */
export interface ControllerConfig {
  /**
   * Defines route under which all nested routes will be available
   */
  route: string;

  /**
   * Defines controller creation behavior
   */
  scope?: Scope;

  /**
   * List of tags to group endpoints in swagger
   *
   * by default this list is empty, adding tags here will add same tags to all methods inside controller.
   * In case if method has own set of tags they will have higher priority instead of controller tags
   */
  tags?: TagObject[];
}

function makeConfig(mayBeRoute?: string | ControllerConfig): Required<ControllerConfig> {
  if (!mayBeRoute) {
    return { route: '/', scope: Scope.SINGLETON, tags: [] };
  }

  if (typeof mayBeRoute === 'string') {
    return { route: mayBeRoute, scope: Scope.SINGLETON, tags: [] };
  }

  return { scope: Scope.SINGLETON, tags: [], ...mayBeRoute };
}

/**
 * Factory function which accepts controller configuration
 * and returns ES / Legacy decorator function to apply on class
 *
 * @param config - route or ControllerConfig or nothing
 * @returns decorator for class
 */
export function Controller(): ClassDecorator;
export function Controller(route: string): ClassDecorator;
export function Controller(config: ControllerConfig): ClassDecorator;
export function Controller(routeOrConfig?: string | ControllerConfig): ClassDecorator {
  const config = makeConfig(routeOrConfig);

  return classDecoratorFactory((target, metadata) => {
    makeRegistrable(target, metadata, config.scope, config.tags, config.route);
  });
}
