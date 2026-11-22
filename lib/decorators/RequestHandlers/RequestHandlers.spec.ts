import {RouteShorthandOptions} from "fastify";
import {CREATOR} from "../../Symbols/index.js";
import {ALL,DELETE,GET,QUERY,HEAD,OPTIONS,PATCH,POST,PUT} from "./RequestHandlers.js";

describe("Decorators:request handlers",()=>{
    it("should instantiate a ALL handler",()=>{
        class Instance {
            constructor(private url:string,private options:RouteShorthandOptions) { }

            all(url:string,options:RouteShorthandOptions) {
                expect(url).toEqual(this.url);
                expect(options).toEqual(this.options);
            }
        }

        class Handler { }

        const instance=new Instance("/",{});
        const decorate=ALL("/");

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);
    });

    it("should instantiate a GET handler",()=>{
        class Instance {
            constructor(private url:string,private options:RouteShorthandOptions) { }

            get(url:string,options:RouteShorthandOptions) {
                expect(url).toEqual(this.url);
                expect(options).toEqual(this.options);
            }
        }

        class Handler { }

        const instance=new Instance("/",{});
        const decorate=GET("/");

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);
    });

    it("should instantiate a QUERY handler",()=>{
        class Instance {
            constructor(private url:string,private options:RouteShorthandOptions) { }

            query(url:string,options:RouteShorthandOptions) {
                expect(url).toEqual(this.url);
                expect(options).toEqual(this.options);
            }
        }

        class Handler { }

        const instance=new Instance("/",{});
        const decorate=QUERY("/");

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);
    });

    it("should instantiate a POST handler",()=>{
        class Instance {
            constructor(private url:string,private options:RouteShorthandOptions) { }

            post(url:string,options:RouteShorthandOptions) {
                expect(url).toEqual(this.url);
                expect(options).toEqual(this.options);
            }
        }

        class Handler { }

        const instance=new Instance("/",{});
        const decorate=POST("/");

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);
    });

    it("should instantiate a DELETE handler",()=>{
        class Instance {
            constructor(private url:string,private options:RouteShorthandOptions) { }

            delete(url:string,options:RouteShorthandOptions) {
                expect(url).toEqual(this.url);
                expect(options).toEqual(this.options);
            }
        }

        class Handler { }

        const instance=new Instance("/",{});
        const decorate=DELETE("/");

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);
    });

    it("should instantiate a HEAD handler",()=>{
        class Instance {
            constructor(private url:string,private options:RouteShorthandOptions) { }

            head(url:string,options:RouteShorthandOptions) {
                expect(url).toEqual(this.url);
                expect(options).toEqual(this.options);
            }
        }

        class Handler { }

        const instance=new Instance("/",{});
        const decorate=HEAD("/");

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);
    });

    it("should instantiate a OPTIONS handler",()=>{
        class Instance {
            constructor(private _url:string,private _options:RouteShorthandOptions) { }

            options(url:string,options:RouteShorthandOptions) {
                expect(url).toEqual(this._url);
                expect(options).toEqual(this._options);
            }
        }

        class Handler { }

        const instance=new Instance("/",{});
        const decorate=OPTIONS("/");

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);
    });

    it("should instantiate a PATCH handler",()=>{
        class Instance {
            constructor(private url:string,private options:RouteShorthandOptions) { }

            patch(url:string,options:RouteShorthandOptions) {
                expect(url).toEqual(this.url);
                expect(options).toEqual(this.options);
            }
        }

        class Handler { }

        const instance=new Instance("/",{});
        const decorate=PATCH("/");

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);
    });

    it("should instantiate a PUT handler",()=>{
        class Instance {
            constructor(private url:string,private options:RouteShorthandOptions) { }

            put(url:string,options:RouteShorthandOptions) {
                expect(url).toEqual(this.url);
                expect(options).toEqual(this.options);
            }
        }

        class Handler { }

        const instance=new Instance("/",{});
        const decorate=PUT("/");

        decorate(Handler);

        // @ts-expect-error created implicitly by decorate
        Handler[CREATOR].register(instance);
    });
});
