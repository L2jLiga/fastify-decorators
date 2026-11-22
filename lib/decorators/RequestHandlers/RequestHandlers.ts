import type {RouteShorthandOptions} from "fastify";
import type {RouteConfig} from "../../Interfaces/index.js";
import {requestDecoratorsFactory} from "../Helpers/request-decorators.factory.js";


export function ALL():HttpRequestHandler;
export function ALL(url:string,options?:RouteShorthandOptions):HttpRequestHandler;
export function ALL(config:RouteConfig):HttpRequestHandler;
export function ALL(
    config?:string|RouteConfig,
    options?:RouteShorthandOptions,
):HttpRequestHandler {
    return requestDecoratorsFactory("all")(config,options);
}

export function GET():HttpRequestHandler;
export function GET(url:string,options?:RouteShorthandOptions):HttpRequestHandler;
export function GET(config:RouteConfig):HttpRequestHandler;
export function GET(
    config?:string|RouteConfig,
    options?:RouteShorthandOptions,
):HttpRequestHandler {
    return requestDecoratorsFactory("get")(config,options);
}

export function QUERY():HttpRequestHandler;
export function QUERY(url:string,options?:RouteShorthandOptions):HttpRequestHandler;
export function QUERY(config:RouteConfig):HttpRequestHandler;
export function QUERY(
    config?:string|RouteConfig,
    options?:RouteShorthandOptions,
):HttpRequestHandler {
    //@ts-ignore
    return requestDecoratorsFactory("query")(config,options);
}

export function POST():HttpRequestHandler;
export function POST(url:string,options?:RouteShorthandOptions):HttpRequestHandler;
export function POST(config:RouteConfig):HttpRequestHandler;
export function POST(
    config?:string|RouteConfig,
    options?:RouteShorthandOptions,
):HttpRequestHandler {
    return requestDecoratorsFactory("post")(config,options);
}

export function PUT():HttpRequestHandler;
export function PUT(url:string,options?:RouteShorthandOptions):HttpRequestHandler;
export function PUT(config:RouteConfig):HttpRequestHandler;
export function PUT(
    config?:string|RouteConfig,
    options?:RouteShorthandOptions,
):HttpRequestHandler {
    return requestDecoratorsFactory("put")(config,options);
}

export function PATCH():HttpRequestHandler;
export function PATCH(url:string,options?:RouteShorthandOptions):HttpRequestHandler;
export function PATCH(config:RouteConfig):HttpRequestHandler;
export function PATCH(
    config?:string|RouteConfig,
    options?:RouteShorthandOptions,
):HttpRequestHandler {
    return requestDecoratorsFactory("patch")(config,options);
}

export function DELETE():HttpRequestHandler;
export function DELETE(url:string,options?:RouteShorthandOptions):HttpRequestHandler;
export function DELETE(config:RouteConfig):HttpRequestHandler;
export function DELETE(
    config?:string|RouteConfig,
    options?:RouteShorthandOptions,
):HttpRequestHandler {
    return requestDecoratorsFactory("delete")(config,options);
}

export function OPTIONS():HttpRequestHandler;
export function OPTIONS(url:string,options?:RouteShorthandOptions):HttpRequestHandler;
export function OPTIONS(config:RouteConfig):HttpRequestHandler;
export function OPTIONS(
    config?:string|RouteConfig,
    options?:RouteShorthandOptions,
):HttpRequestHandler {
    return requestDecoratorsFactory("options")(config,options);
}

export function HEAD():HttpRequestHandler;
export function HEAD(url:string,options?:RouteShorthandOptions):HttpRequestHandler;
export function HEAD(config:RouteConfig):HttpRequestHandler;
export function HEAD(
    config?:string|RouteConfig,
    options?:RouteShorthandOptions,
):HttpRequestHandler {
    return requestDecoratorsFactory("head")(config,options);
}

type HttpRequestHandler=(target:unknown,propKey?:string|symbol)=>void;
