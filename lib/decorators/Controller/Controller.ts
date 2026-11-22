import type {FastifyInstance} from "fastify";
import type {InjectableClass} from "../../Interfaces/injectable-class.js";
import {CLASS_LOADER, CREATOR} from "../../Symbols/index.js";
import {SwaggerHelper,ControllerHelper} from "../Helpers/index.js";
import {MethodPatcher} from "../Helpers/index.js";
import {toControllerType,ControllerTypeLiteral,ControllerType,ControllerTypeStrategies} from "./ControllerType.js";
import LifecycleHook from "./LifecycleHook.js";


export function Controller():ClassDecorator;
export function Controller(route:string):ClassDecorator;
export function Controller(config:ControllerConfig):ClassDecorator;
export function Controller(config?:string|ControllerConfig){
    return (controller:InjectableClass)=>{
        config=toControllerConfig(config);
        const {route,type}=config;

        ControllerHelper.injectOptions(controller);
        MethodPatcher.patchMethods(controller);

        controller[CREATOR].register=async (
            fastify:FastifyInstance,
            prefix="",
            classLoader=fastify[CLASS_LOADER],
        )=>{
            let instance;
            await fastify.register(async (fastify)=>{
                instance=ControllerTypeStrategies[toControllerType(type)](
                    fastify,controller,classLoader,
                    config as ControllerConfig,
                );
            },{
                prefix:prefix+route,
            });
            return instance;
        };
    };
}

const toControllerConfig=(config?:string|ControllerConfig):Required<ControllerConfig>=>{
    if(typeof(config)==="string") config={ route:config };
    return { 
        type:"singleton", 
        route:"/",
        tags:[],
        hooks:[],
        ...config, 
    };
}

export type ControllerConfig={
    /**
     * Controller base route
     */
    route:string;   
    /**
     * Controller type
     */
    type?:ControllerType|ControllerTypeLiteral;
    /**
     * List of tags to group endpoints in swagger
     *
     * by default this list is empty, adding tags here will add same tags to all methods inside controller.
     * In case if method has own set of tags they will have higher priority instead of controller tags
     */
    tags?:SwaggerHelper.TagObject[];
    /**
     * added custom lifecycle hooks to this controller
     */
    hooks?:LifecycleHook[],
}
