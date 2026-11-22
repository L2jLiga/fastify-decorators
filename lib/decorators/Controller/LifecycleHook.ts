import {RouteShorthandOptions,RouteOptions} from "fastify";
import {LifecycleHook as FasitfyLifecycle} from "fastify/types/hooks";


export default class LifecycleHook {

    static register(hook:LifecycleHook,options:RouteShorthandOptions){
        const lifecycle=hook.lifecycle||"onRequest";
        if(!Array.isArray(options[lifecycle])) options[lifecycle]=[];
        const {handler}=hook,handlers=options[lifecycle];
        //@ts-ignore
        if(handlers.includes(handler)){
            throw new Error(`hook ${hook.name} is already registered`);
        } else {
            const {hooks}=hook;
            if(Array.isArray(hooks)&&hooks.length){
                for(const hook of hooks) LifecycleHook.register(hook,options);
            }
            //@ts-ignore
            handlers.push(hook.handler);
        }
    }
}

export default interface LifecycleHook {
    name:string;
    hooks?:Array<LifecycleHook>,
    /**
     * @default "onRequest"
     */
    lifecycle?:FasitfyLifecycle;
    handler:ArrayElement<RouteOptions[FasitfyLifecycle]>;
}

type ArrayElement<T>=T extends readonly (infer U)[]?U:T;
