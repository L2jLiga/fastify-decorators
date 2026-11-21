import type {PathLike} from "fs";
import {Constructor} from "../Decorators/Helpers/inject-dependencies.js";
import {ClassLoader} from "../Interfaces/index.js";


/**
 * decorators plugin config
 */
export type DecoratorsPluginConfig=AutoLoadConfig|ControllersListConfig;

export type AutoLoadConfig=DecoratorsPluginStaticConfig&{
    /**
     * Path to directory which contains files to load
     */
    directory:PathLike;
    /**
     * Mask used to filter files to load
     * @default /\.(handler|controller)\./
     */
    mask?:string|RegExp;
    /**
     * By default application will fails to bootstrap if one or more of loaded files does not contain valid controller or handler
     * This option allows to change this behavior
     * @default false
     */
    skipBroken?:boolean;
}

export type ControllersListConfig=DecoratorsPluginStaticConfig&{
    /**
     * List of Controller classes to bootstrap
     */
    controllers:Constructor<unknown>[];
    /**
     * By default application will fails to bootstrap if one or more of loaded files does not contain valid controller or handler
     * This option allows to change this behavior
     * @default false
     */
    skipBroken?:boolean;
}

type DecoratorsPluginStaticConfig={
    /**
     * Defines method to create class instance
     * @param constructor
     */
    classLoader?:ClassLoader;
    /**
     * Global prefix to be applied for all routes
     */
    prefix?:string;
}

