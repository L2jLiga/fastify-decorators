import {RouteOptions} from "fastify";
import {LifecycleHook as FasitfyLifecycle} from "fastify/types/hooks";


export default class LifecycleHook {

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
