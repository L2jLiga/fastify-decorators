import { HTTPMethods, RouteShorthandOptions } from 'fastify';
import { getContainer } from '../utils/container-utils.js';
import { classOrMethodDecoratorBuilder, CombinedClassOrMethodDecorator } from './interop/class-or-method-decorator.js';
import { REQUEST_HANDLER } from '../constants/symbols.js';
import { makeRegistrable } from './helpers/registrable.js';
import { TagObject } from './helpers/swagger-helper.js';

/**
 * Common config for all route handlers
 */
export interface RouteConfig {
  /**
   * Route url which will be passed to Fastify
   */
  url: string;

  /**
   * Route options which will be passed to Fastify
   */
  options?: RouteShorthandOptions;

  /**
   * List of tags to group endpoints in swagger
   *
   * by default this list is empty, adding tags here will add same tags to all methods inside controller.
   * In case if method has own set of tags they will have higher priority instead of controller tags
   */
  tags?: TagObject[];
}

/**
 * Marks method/class as handler for ANY requests
 */
export function ALL(route?: string, options?: RouteShorthandOptions): CombinedClassOrMethodDecorator;
export function ALL(config?: RouteConfig): CombinedClassOrMethodDecorator;
export function ALL(config: string | RouteConfig = '/', options: RouteShorthandOptions = {}): CombinedClassOrMethodDecorator {
  return RequestHandlerDecoratorBuilder('all', config, options);
}
/**
 * Marks method/class as handler for OPTIONS requests
 */
export function OPTIONS(route?: string, options?: RouteShorthandOptions): CombinedClassOrMethodDecorator;
export function OPTIONS(config?: RouteConfig): CombinedClassOrMethodDecorator;
export function OPTIONS(config: string | RouteConfig = '/', options: RouteShorthandOptions = {}): CombinedClassOrMethodDecorator {
  return RequestHandlerDecoratorBuilder('options', config, options);
}

/**
 * Marks method/class as handler for POST requests
 */
export function POST(route?: string, options?: RouteShorthandOptions): CombinedClassOrMethodDecorator;
export function POST(config?: RouteConfig): CombinedClassOrMethodDecorator;
export function POST(config: string | RouteConfig = '/', options: RouteShorthandOptions = {}): CombinedClassOrMethodDecorator {
  return RequestHandlerDecoratorBuilder('post', config, options);
}

/**
 * Marks method/class as handler for HEAD requests
 */
export function HEAD(route?: string, options?: RouteShorthandOptions): CombinedClassOrMethodDecorator;
export function HEAD(config?: RouteConfig): CombinedClassOrMethodDecorator;
export function HEAD(config: string | RouteConfig = '/', options: RouteShorthandOptions = {}): CombinedClassOrMethodDecorator {
  return RequestHandlerDecoratorBuilder('head', config, options);
}

/**
 * Marks method/class as handler for GET requests
 */
export function GET(route?: string, options?: RouteShorthandOptions): CombinedClassOrMethodDecorator;
export function GET(config?: RouteConfig): CombinedClassOrMethodDecorator;
export function GET(config: string | RouteConfig = '/', options: RouteShorthandOptions = {}): CombinedClassOrMethodDecorator {
  return RequestHandlerDecoratorBuilder('get', config, options);
}

/**
 * Marks method/class as handler for PUT requests
 */
export function PUT(route?: string, options?: RouteShorthandOptions): CombinedClassOrMethodDecorator;
export function PUT(config?: RouteConfig): CombinedClassOrMethodDecorator;
export function PUT(config: string | RouteConfig = '/', options: RouteShorthandOptions = {}): CombinedClassOrMethodDecorator {
  return RequestHandlerDecoratorBuilder('put', config, options);
}

/**
 * Marks method/class as handler for PATCH requests
 */
export function PATCH(route?: string, options?: RouteShorthandOptions): CombinedClassOrMethodDecorator;
export function PATCH(config?: RouteConfig): CombinedClassOrMethodDecorator;
export function PATCH(config: string | RouteConfig = '/', options: RouteShorthandOptions = {}): CombinedClassOrMethodDecorator {
  return RequestHandlerDecoratorBuilder('patch', config, options);
}

/**
 * Marks method/class as handler for DELETE requests
 */
export function DELETE(route?: string, options?: RouteShorthandOptions): CombinedClassOrMethodDecorator;
export function DELETE(config?: RouteConfig): CombinedClassOrMethodDecorator;
export function DELETE(config: string | RouteConfig = '/', options: RouteShorthandOptions = {}): CombinedClassOrMethodDecorator {
  return RequestHandlerDecoratorBuilder('delete', config, options);
}

/**
 * Marks method/class as handler for GET requests
 */
export function REQUEST(method: HTTPMethods | 'all' | 'ALL', route?: string, options?: RouteShorthandOptions): CombinedClassOrMethodDecorator;
export function REQUEST(method: HTTPMethods | 'all' | 'ALL', config?: RouteConfig): CombinedClassOrMethodDecorator;
export function REQUEST(
  method: HTTPMethods | 'all' | 'ALL',
  config: string | RouteConfig = '/',
  options: RouteShorthandOptions = {},
): CombinedClassOrMethodDecorator {
  return RequestHandlerDecoratorBuilder(method, config, options);
}

interface ParsedRouteConfig {
  url: string;
  options: RouteShorthandOptions;
  tags: TagObject[];
}

function parseConfig(config: string | RouteConfig, options: RouteShorthandOptions): ParsedRouteConfig {
  if (typeof config === 'string') return { url: config, tags: [], options };

  const parsed = { options, tags: [], ...config };
  return {
    ...parsed,
    options: { ...parsed.options },
  };
}

function RequestHandlerDecoratorBuilder(httpMethod: HTTPMethods | 'all' | 'ALL', sourceConfig: string | RouteConfig, options: RouteShorthandOptions) {
  const config = parseConfig(sourceConfig, options);
  return classOrMethodDecoratorBuilder((target, metadata, propertyKey) => {
    const container = getContainer(metadata, REQUEST_HANDLER);

    if (!propertyKey) {
      makeRegistrable(target, metadata, 'RequestHandler', config.tags, config.url);
    }

    container.push({
      url: propertyKey ? config.url : '/',
      method: httpMethod.toLowerCase() as Lowercase<HTTPMethods | 'all'>,
      options: config.options,
      handlerName: propertyKey ?? 'handle',
    });
  });
}
