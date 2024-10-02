import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { lstatSync, PathLike } from 'node:fs';
import { opendir } from 'node:fs/promises';
import type { BootstrapConfig } from '../interfaces/bootstrap-config.js';
import { transformAndWait } from '../utils/transform-and-wait.js';
import { hooksRegistry } from '../registry/hooks-registry.js';
import { REGISTRABLE } from '../constants/symbols.js';
import { CLASS_LOADER, ClassLoader } from '../plugins/class-loader.js';

const defaultMask = /\.(handler|controller)\./;

/**
 * Fastify plugin responsible for bootstraping
 * fastify-decorators.
 */
export const bootstrap = fp<BootstrapConfig>(
  async (fastifyInstance: FastifyInstance, config: BootstrapConfig): Promise<void> => {
    // 1. Load all modules
    const toBootstrap = new Set<object>();
    if ('directory' in config) await transformAndWait(autoLoadModules(config), toBootstrap.add.bind(toBootstrap));
    if ('controllers' in config) await transformAndWait(config.controllers ?? [], toBootstrap.add.bind(toBootstrap));

    // 2. Run appInit hooks
    await transformAndWait(hooksRegistry.appInit, (hook) => hook(fastifyInstance));

    // 3. Register default class loader in case if missing
    if (!fastifyInstance.hasDecorator(CLASS_LOADER)) {
      const classLoader: ClassLoader = config.classLoader ?? (((T: object) => new (T as { new (): unknown })()) as ClassLoader);
      fastifyInstance.decorate(CLASS_LOADER, classLoader);
    } else if (config.classLoader) {
      throw new Error('Some library already defines class loader, passing custom class loader via config impossible');
    }

    // 4. Instantiate all modules
    await transformAndWait(toBootstrap, loadRegistrable.bind(fastifyInstance, config));

    // 5. Run appReady hooks
    await transformAndWait(hooksRegistry.appReady, (hook) => hook(fastifyInstance));

    // 6. Register on close hooks
    fastifyInstance.addHook('onClose', () => transformAndWait(hooksRegistry.appDestroy, (hook) => hook(fastifyInstance)));
  },
  {
    fastify: '^4.0.0 || ^5.0.0',
    name: 'fastifyDecorators',
  },
);

/**
 * Automatically loads modules from filesystem
 */
function autoLoadModules(config: BootstrapConfig): AsyncIterable<object> {
  const flags = config.mask instanceof RegExp ? config.mask.flags.replace('g', '') : '';
  const mask = config.mask ? new RegExp(config.mask, flags) : defaultMask;

  return readModulesRecursively(getBaseDirOf(config.directory as PathLike), mask);
}

/**
 * Function accepts anything path-like and transforms
 * it to URL object linking to the base directory.
 *
 * @example
 * ```typescript
 * parsePath(import.meta.url) // returns URL to directory containing file from which function was called
 * parsePath(__filename)      // same as above
 * parsePath(__dirname)       // converts dirname into URL
 * parsePath(process.cwd)     // converts process working directory into URL
 * ```
 */
function getBaseDirOf(pathLike: PathLike): URL {
  const urlLike = pathLike.toString('utf8');
  const url = urlLike.startsWith('file://') ? new URL(urlLike) : new URL('file://' + urlLike);

  if (lstatSync(url).isFile()) url.pathname += './..';
  return url;
}

async function* readModulesRecursively(parentUrl: URL, mask: RegExp): AsyncIterable<object> {
  for await (const dirent of await opendir(parentUrl)) {
    const fullFilePath = new URL(dirent.name, parentUrl + '/');
    if (dirent.isDirectory()) {
      yield* readModulesRecursively(fullFilePath, mask);
    } else if (mask.test(dirent.name)) {
      yield import(fullFilePath.toString()).then((m) => m.default);
    }
  }
}

function loadRegistrable(this: FastifyInstance, config: BootstrapConfig, constructable: object): Promise<unknown> | void {
  if (isValidRegistrable(constructable)) {
    return constructable[REGISTRABLE](this);
  } else if (!config.skipBroken) {
    throw new TypeError(`Loaded file is incorrect module and can not be bootstrapped: ${constructable}`);
  }
}

function isValidRegistrable(target: object): target is { [REGISTRABLE]: (instance: FastifyInstance) => Promise<unknown> } {
  return target && REGISTRABLE in target;
}
