import type {RouteShorthandOptions} from "fastify";
import {requestDecoratorsFactory} from "./RequestDecoratorsFactory.js";
import {LifecycleHook} from "../Controller/index.js";


export function ALL():HttpRequestHandler;
export function ALL(url:string,options?:HttpRequestHandlerOptions):HttpRequestHandler;
export function ALL(config:RouteConfig):HttpRequestHandler;
export function ALL(
    config?:string|RouteConfig,
    options?:HttpRequestHandlerOptions,
):HttpRequestHandler {
    registerLifecycleHooks("ALL",config,options);
    return requestDecoratorsFactory("all")(config,options);
}

export function GET():HttpRequestHandler;
export function GET(url:string,options?:HttpRequestHandlerOptions):HttpRequestHandler;
export function GET(config:RouteConfig):HttpRequestHandler;
export function GET(
    config?:string|RouteConfig,
    options?:HttpRequestHandlerOptions,
):HttpRequestHandler {
    registerLifecycleHooks("GET",config,options);
    return requestDecoratorsFactory("get")(config,options);
}

export function QUERY():HttpRequestHandler;
export function QUERY(url:string,options?:HttpRequestHandlerOptions):HttpRequestHandler;
export function QUERY(config:RouteConfig):HttpRequestHandler;
export function QUERY(
    config?:string|RouteConfig,
    options?:HttpRequestHandlerOptions,
):HttpRequestHandler {
    registerLifecycleHooks("QUERY",config,options);
    //@ts-ignore still does not recognize the query method
    return requestDecoratorsFactory("query")(config,options);
}

export function POST():HttpRequestHandler;
export function POST(url:string,options?:HttpRequestHandlerOptions):HttpRequestHandler;
export function POST(config:RouteConfig):HttpRequestHandler;
export function POST(
    config?:string|RouteConfig,
    options?:HttpRequestHandlerOptions,
):HttpRequestHandler {
    registerLifecycleHooks("POST",config,options);
    return requestDecoratorsFactory("post")(config,options);
}

export function PUT():HttpRequestHandler;
export function PUT(url:string,options?:HttpRequestHandlerOptions):HttpRequestHandler;
export function PUT(config:RouteConfig):HttpRequestHandler;
export function PUT(
    config?:string|RouteConfig,
    options?:HttpRequestHandlerOptions,
):HttpRequestHandler {
    registerLifecycleHooks("PUT",config,options);
    return requestDecoratorsFactory("put")(config,options);
}

export function PATCH():HttpRequestHandler;
export function PATCH(url:string,options?:HttpRequestHandlerOptions):HttpRequestHandler;
export function PATCH(config:RouteConfig):HttpRequestHandler;
export function PATCH(
    config?:string|RouteConfig,
    options?:HttpRequestHandlerOptions,
):HttpRequestHandler {
    registerLifecycleHooks("PATCH",config,options);
    return requestDecoratorsFactory("patch")(config,options);
}

export function DELETE():HttpRequestHandler;
export function DELETE(url:string,options?:HttpRequestHandlerOptions):HttpRequestHandler;
export function DELETE(config:RouteConfig):HttpRequestHandler;
export function DELETE(
    config?:string|RouteConfig,
    options?:HttpRequestHandlerOptions,
):HttpRequestHandler {
    registerLifecycleHooks("DELETE",config,options);
    return requestDecoratorsFactory("delete")(config,options);
}

export function OPTIONS():HttpRequestHandler;
export function OPTIONS(url:string,options?:HttpRequestHandlerOptions):HttpRequestHandler;
export function OPTIONS(config:RouteConfig):HttpRequestHandler;
export function OPTIONS(
    config?:string|RouteConfig,
    options?:HttpRequestHandlerOptions,
):HttpRequestHandler {
    registerLifecycleHooks("OPTIONS",config,options);
    return requestDecoratorsFactory("options")(config,options);
}

export function HEAD():HttpRequestHandler;
export function HEAD(url:string,options?:HttpRequestHandlerOptions):HttpRequestHandler;
export function HEAD(config:RouteConfig):HttpRequestHandler;
export function HEAD(
    config?:string|RouteConfig,
    options?:HttpRequestHandlerOptions,
):HttpRequestHandler {
    registerLifecycleHooks("HEAD",config,options);
    return requestDecoratorsFactory("head")(config,options);
}

const registerLifecycleHooks=(
    method:string,
    route:string|RouteConfig|undefined,
    options:HttpRequestHandlerOptions|undefined,
)=>{
    if(options) try {
        const lifecycleHooks=options.hooks;
        if(Array.isArray(lifecycleHooks)) lifecycleHooks.forEach(hook=>{
            LifecycleHook.register(hook,options);    
        });
    } catch(error){
        if(typeof(route)!=="string") route=route?.url||"/";
        throw new Error(`${method} ${route}: ${(error as Error).message}`);
    }
}

export interface RouteConfig {
    /**
     * Route url which will be passed to Fastify
     */
    url:string;

    /**
     * Route options which will be passed to Fastify
     */
    options?:RouteShorthandOptions;
}

type HttpRequestHandler=(target:unknown,propKey?:string|symbol)=>void;

type HttpRequestHandlerOptions=RouteShorthandOptions&{
    hooks?:Array<LifecycleHook>,
}
