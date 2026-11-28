import {type FastifyRequest} from "fastify";
import {LifecycleHook} from "fastify-decorators";
import Authenticated from "./Authenticated";
import {NotAdminError} from "../Errors";


export default {
    name:"AdminOnly",
    hooks:[Authenticated],
    handler:async (request:FastifyRequest)=>{
        const {user}=request;
        if(user!=="admin") throw NotAdminError;
    },
} as LifecycleHook;