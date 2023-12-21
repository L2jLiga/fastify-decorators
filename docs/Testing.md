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
- [`jest-resolve`](https://www.npmjs.com/package/jest-resolve)
- [`jest-ts-webcompat-resolver`](https://www.npmjs.com/package/jest-ts-webcompat-resolver)
- [`ts-jest`](https://www.npmjs.com/package/ts-jest)
- [`cross-env`](https://www.npmjs.com/package/cross-env)

**Configuration steps**:

1. Set type to module and enable experimental VM modules in `package.json`
2. Set ts-jest ESM preset in Jest config
3. Set jest-ts-webcompat-resolver as resolver

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
