import {type FastifyRequest} from "fastify";
import {getInstanceByToken,LifecycleHook} from "fastify-decorators";
import UsersService from "../Components/Users/Users.service";
import {AuthenticationError,UserNotFoundError} from "../Errors";


export default {
    name:"Authenticated",
    handler:async (request:FastifyRequest)=>{
        const usersService=getInstanceByToken<UsersService>(UsersService);
        const {username}=request.cookies;
        if(username){
            const exist=await usersService.findUser(username);
            if(exist) request.user=username;
            else throw UserNotFoundError;
        }
        else throw AuthenticationError;
    },
} as LifecycleHook;
