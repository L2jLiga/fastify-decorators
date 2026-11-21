import type {PathLike} from "fs";
import {Constructor} from "../Decorators/Helpers/inject-dependencies.js";
import {ClassLoader} from "../Interfaces/index.js";


/**
 * Config for application bootstrap
 */
export type BootstrapConfig=AutoLoadConfig|ControllersListConfig;

export type AutoLoadConfig=BootstrapStaticConfig&{
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

export type ControllersListConfig=BootstrapStaticConfig&{
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

type BootstrapStaticConfig={
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

