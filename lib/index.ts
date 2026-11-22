

export {RequestHandler} from "./Interfaces/request-handler.js";
export {injectablesHolder} from "./Registry/injectables-holder.js";
export {getInstanceByToken} from "./Utils/get-instance-by-token.js";
export {FastifyInstanceToken,FastifyRequestToken,FastifyReplyToken} from "./Symbols/index.js";
export {
    DecoratorsPlugin as default,
    DecoratorsPlugin as bootstrap,
} from "./DecoratorsPlugin/index.js";

export * from "./Decorators/index.js";
export * from "./DecoratorsPlugin/index.js";
