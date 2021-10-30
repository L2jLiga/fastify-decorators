<h1 style="text-align: center">Fastify decorators</h1>

## Testing

### Table of content:

- [Configuring test framework](#configuring-test-framework)
  - [Jest](#jest--27)
  - [Mocha](#mocha)
- [Bootstrap whole server](#bootstrap-whole-server)

### Configuring test framework

#### Jest <= 26

Not supported

#### Jest >= 27

Packages to be installed:

- [`@types/jest`](https://www.npmjs.com/package/@types/jest)
- [`jest`](https://www.npmjs.com/package/jest)
- [`jest-resolver`](https://www.npmjs.com/package/jest-resolver)
- [`jest-ts-webcompat-resolver`](https://www.npmjs.com/package/jest-ts-webcompat-resolver)
- [`ts-jest`](https://www.npmjs.com/package/ts-jest)
- [`cross-env`](https://www.npmjs.com/package/cross-env)

**Configuration steps**:

1. Set type to module and enable experimental VM modules in `package.json`
2. Set ts-jest ESM preset in Jest config
3. Set jest-ts-webcompat-resolver as resolver
4. In case of using autoload feature setup [workers workaround](#dynamic-import-in-esm-workaround)

Example configuration:

_package.json_:

```json
{
  "type": "module",
  "scripts": {
    "test": "cross-env NODE_OPTIONS=--experimental-vm-modules jest"
  }
}
```

_jest.config.js_:

```javascript
export default {
  preset: 'ts-jest/presets/default-esm',
  // Note resolver required only when using imports with extensions
  resolver: 'jest-ts-webcompat-resolver',
};
```

##### Dynamic import in ESM workaround

There's known issue in Jest when using dynamic imports in ESM - see [jest#11438](https://github.com/facebook/jest/issues/11438).
This issue may appear when using Fastify-decorators [autoload feature](./Bootstrapping.md#Autoload all controllers).

_Note_: issue fixed in Node.js >= 16.11.0

**Workaround**:

_jest-dynamic-import-esm-workaround.js_:

```javascript
import glob from 'glob';

// Jest issue: https://github.com/facebook/jest/issues/11438
// Workaround for dynamic import + ESM
// Each test file should have separated worker
// So we have to count amount of files with tests per project

const nodeVersionRegex = /(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)/;
const { major, minor } = nodeVersionRegex.exec(process.version).groups;

const isIssueAffectCurrentVersion = Number.parseInt(major) * 100 + Number.parseInt(minor) < 1611;

const testsCount = glob.sync('**/*.{spec,test}.ts').length;

export const workersWorkaround = isIssueAffectCurrentVersion
  ? {
      runInBand: false,
      maxConcurrency: testsCount,
      maxWorkers: testsCount,
      testTimeout: 30_000,
    }
  : {};
```

_jest.config.js_:

```javascript
import { workersWorkaround } from './jest-dynamic-import-esm-workaround.js';

export default {
  preset: 'ts-jest/presets/default-esm',
  // Note resolver required only when using imports with extensions
  resolver: 'jest-ts-webcompat-resolver',
  ...workersWorkaround,
};
```

#### Mocha

Packages to be installed:

- [`@types/mocha`](https://www.npmjs.com/package/@types/mocha)
- [`mocha`](https://www.npmjs.com/package/mocha)
- [`ts-node`](https://www.npmjs.com/package/ts-node)

Example configuration:

_.mocharc.yml_:

```yaml
# Common Mocha options
bail: false
timeout: 10000
enable-source-maps: true
v8-stack-trace-limit: 100
extension:
  - 'ts'
# Enable experimental TS ESM loader
loader:
  - ts-node/esm
# Specify tests pattern
spec:
  - test/**/*.test.ts
  - test/**/*.spec.ts
```

### Bootstrap whole server

It also possible to test application by bootstrap everything. It comparable to normal run.
Difference is server will not run.

_Note_: read more at [Fastify testing documentation](https://github.com/fastify/fastify/blob/master/docs/Testing.md)

_Example_:

_src/index.ts_:

```ts
import fastify from 'fastify';

const instance = fastify({
  /* options */
});

/* your code */

export { instance };
```

_test/auth.spec.ts_:

```ts
import { instance } from '../src';

describe('Application: authorization', () => {
  beforeEach(() => {
    /* Setup logic for test */
  });
  afterEach(() => {
    /* Teardown logic for test */
  });

  it('should check credentials and reply with result', async () => {
    const payload = { login: 'test', password: 'test' };

    const result = await instance.inject({
      url: '/auth/authorize',
      method: 'POST',
      payload,
    });

    expect(JSON.parse(result.body)).toEqual({ message: 'ok' });
  });
});
```

[`reflect-metadata`]: https://npmjs.com/package/reflect-metadata
