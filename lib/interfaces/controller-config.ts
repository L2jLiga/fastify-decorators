import { TagObject } from '../decorators/helpers/swagger-helper.js';
import type { ControllerType } from '../registry/controller-type.js';

/**
 * Config for controllers
 */
export interface ControllerConfig {
  /**
   * Controller base route
   */
  route?: string;

  /**
   * Controller type
   */
  type?: ControllerType;

  /**
   * List of tags to group endpoints in swagger
   *
   * by default this list is empty, adding tags here will add same tags to all methods inside controller.
   * In case if method has own set of tags they will have higher priority instead of controller tags
   */
  tags?: TagObject[];
}
