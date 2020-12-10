import { RouteShorthandOptions } from 'fastify';
import { CREATOR } from '../symbols/index.js';
import { ALL, DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT } from './request-handlers.js';

describe('Decorators: request handlers', () => {
  it('should instantiate ALL handler', () => {
    class Instance {
      constructor(private url: string, private options: RouteShorthandOptions) {}

      all(url: string, options: RouteShorthandOptions) {
        expect(url).toEqual(this.url);
        expect(options).toEqual(this.options);
      }
    }

    class Handler {}

    const instance = new Instance('/', {});
    const decorate = ALL('/');

    decorate(Handler);

    // @ts-expect-error created implicitly by decorate
    Handler[CREATOR].register(instance);
  });

  it('should instantiate GET handler', () => {
    class Instance {
      constructor(private url: string, private options: RouteShorthandOptions) {}

      get(url: string, options: RouteShorthandOptions) {
        expect(url).toEqual(this.url);
        expect(options).toEqual(this.options);
      }
    }

    class Handler {}

    const instance = new Instance('/', {});
    const decorate = GET('/');

    decorate(Handler);

    // @ts-expect-error created implicitly by decorate
    Handler[CREATOR].register(instance);
  });

  it('should instantiate POST handler', () => {
    class Instance {
      constructor(private url: string, private options: RouteShorthandOptions) {}

      post(url: string, options: RouteShorthandOptions) {
        expect(url).toEqual(this.url);
        expect(options).toEqual(this.options);
      }
    }

    class Handler {}

    const instance = new Instance('/', {});
    const decorate = POST('/');

    decorate(Handler);

    // @ts-expect-error created implicitly by decorate
    Handler[CREATOR].register(instance);
  });

  it('should instantiate DELETE handler', () => {
    class Instance {
      constructor(private url: string, private options: RouteShorthandOptions) {}

      delete(url: string, options: RouteShorthandOptions) {
        expect(url).toEqual(this.url);
        expect(options).toEqual(this.options);
      }
    }

    class Handler {}

    const instance = new Instance('/', {});
    const decorate = DELETE('/');

    decorate(Handler);

    // @ts-expect-error created implicitly by decorate
    Handler[CREATOR].register(instance);
  });

  it('should instantiate HEAD handler', () => {
    class Instance {
      constructor(private url: string, private options: RouteShorthandOptions) {}

      head(url: string, options: RouteShorthandOptions) {
        expect(url).toEqual(this.url);
        expect(options).toEqual(this.options);
      }
    }

    class Handler {}

    const instance = new Instance('/', {});
    const decorate = HEAD('/');

    decorate(Handler);

    // @ts-expect-error created implicitly by decorate
    Handler[CREATOR].register(instance);
  });

  it('should instantiate OPTIONS handler', () => {
    class Instance {
      constructor(private _url: string, private _options: RouteShorthandOptions) {}

      options(url: string, options: RouteShorthandOptions) {
        expect(url).toEqual(this._url);
        expect(options).toEqual(this._options);
      }
    }

    class Handler {}

    const instance = new Instance('/', {});
    const decorate = OPTIONS('/');

    decorate(Handler);

    // @ts-expect-error created implicitly by decorate
    Handler[CREATOR].register(instance);
  });

  it('should instantiate PATCH handler', () => {
    class Instance {
      constructor(private url: string, private options: RouteShorthandOptions) {}

      patch(url: string, options: RouteShorthandOptions) {
        expect(url).toEqual(this.url);
        expect(options).toEqual(this.options);
      }
    }

    class Handler {}

    const instance = new Instance('/', {});
    const decorate = PATCH('/');

    decorate(Handler);

    // @ts-expect-error created implicitly by decorate
    Handler[CREATOR].register(instance);
  });

  it('should instantiate PUT handler', () => {
    class Instance {
      constructor(private url: string, private options: RouteShorthandOptions) {}

      put(url: string, options: RouteShorthandOptions) {
        expect(url).toEqual(this.url);
        expect(options).toEqual(this.options);
      }
    }

    class Handler {}

    const instance = new Instance('/', {});
    const decorate = PUT('/');

    decorate(Handler);

    // @ts-expect-error created implicitly by decorate
    Handler[CREATOR].register(instance);
  });
});
