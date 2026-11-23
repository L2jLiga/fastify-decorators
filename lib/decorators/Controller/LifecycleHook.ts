import {RouteShorthandOptions,RouteOptions} from "fastify";
import {LifecycleHook as FasitfyLifecycle} from "fastify/types/hooks";


export default class LifecycleHook {

    static registerAll(
        hooks:LifecycleHook[]|undefined,
        options:RouteShorthandOptions,
    ){
        if(Array.isArray(hooks)&&hooks.length){
            /**
             * Because we're using unshift instead of push,
             * the array has to be reversed to preserve the order 
             */
            hooks.reverse();
            for(const hook of hooks) LifecycleHook.register(hook,options);
        }
    }

    static register(hook:LifecycleHook,options:RouteShorthandOptions){
        const lifecycle=hook.lifecycle||"preHandler";
        const currentOption=options[lifecycle];
        if(!Array.isArray(currentOption)){
            //@ts-ignore
            options[lifecycle]=typeof(currentOption)==="function"?[currentOption]:[];
        }
        const {handler}=hook,handlers=options[lifecycle];
        //@ts-ignore
        if(!handlers.includes(handler)){
            /**
             * because methods and handlers are patched before creating a controller instance,
             * unshift is used instead of push so that hooks passed to the controller are
             * exectued before the hooks attached to the HttpMethod.
             */
            //@ts-ignore
            handlers.unshift(hook.handler);
            LifecycleHook.registerAll(hook.hooks,options);
        }
    }
}

export default interface LifecycleHook {
    name:string;
    /**
     * An array of hooks to be attached with this hook.
     * 
     * Hooks with the same lifecycle value will get executed before this one.
     * 
     * For other lifecycles, fastify's lifecycle order still dictates.
     * @notice If a hook was already found in the fastify hook-lifecycle chain, it will be skipped.
     */
    hooks?:Array<LifecycleHook>,
    /**
     * @default "preHandler"
     */
    lifecycle?:FasitfyLifecycle;
    handler:ArrayElement<RouteOptions[FasitfyLifecycle]>;
}

type ArrayElement<T>=T extends readonly (infer U)[]?U:T;
