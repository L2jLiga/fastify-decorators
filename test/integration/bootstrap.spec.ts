import { instance } from '../../src';

const expectedRoutes = `└── /
    ├── a
    │   ├── uthorized (GET|POST)
    │   │   └── / (GET|POST)
    │   └── ll (DELETE|GET|HEAD|OPTIONS|PATCH|POST|PUT)
    ├── de
    │   ├── mo (GET)
    │   │   └── / (GET)
    │   │       └── test (GET)
    │   └── lete (DELETE)
    ├── throwable/
    │   ├── type-error (GET)
    │   ├── syntax-error (GET)
    │   ├── error (GET)
    │   │   └── -with-code (GET)
    │   └── custom-error (GET)
    ├── websocket/
    │   └── :id (GET)
    ├── get (GET)
    ├── h
    │   ├── andler-with-error (GET)
    │   └── ead (HEAD)
    ├── options (OPTIONS)
    └── p
        ├── atch (PATCH)
        ├── ost (POST)
        └── ut (PUT)
`;

describe('Bootstrap entire application', () => {
    beforeAll(() => instance.ready());
    afterAll(() => instance.close());

    it('should bootstrap entire application and register all routes', () => {
        const routes = instance.printRoutes();

        expect(routes).toBe(expectedRoutes);
    });

    it('should set cookies on authorize', async () => {
        const response = await instance.inject({
            url: '/authorized',
            method: 'POST',
            payload: { login: 'test', password: 'test' },
        });

        expect(response.cookies).toEqual([
            {
                httpOnly: true,
                name: 'token',
                path: '/',
                value: 'dGVzdHRlc3Q=',
            },
        ]);
    });

    it('should bootstrap handlers as well', async () => {
        const res = await instance.inject({
            method: 'GET',
            url: '/get',
        });

        expect(res.statusCode).toBe(200);
        expect(res.payload).toBe(`{"message":"GET works!"}`);
    });

    it('should handler error in RequestHandler', async () => {
        const res = await instance.inject('/handler-with-error');
        const body = await res.json();

        expect(res.statusCode).toEqual(422);
        expect(body).toEqual({ message: 'Not implemented' });
    });
});
