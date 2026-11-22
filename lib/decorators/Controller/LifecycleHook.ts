import {RouteShorthandOptions,RouteOptions} from "fastify";
import {LifecycleHook as FasitfyLifecycle} from "fastify/types/hooks";


export default class LifecycleHook {

    static register(hook:LifecycleHook,options:RouteShorthandOptions){
        const lifecycle=hook.lifecycle||"onRequest";
        if(!Array.isArray(options[lifecycle])) options[lifecycle]=[];
        //@ts-ignore
        options[lifecycle].push(hook.handler);
    }
}

export default interface LifecycleHook {
    name:string;
    /**
     * @default "onRequest"
     */
    lifecycle?:FasitfyLifecycle;
    handler:ArrayElement<RouteOptions[FasitfyLifecycle]>;
}

type ArrayElement<T>=T extends readonly (infer U)[]?U:T;
