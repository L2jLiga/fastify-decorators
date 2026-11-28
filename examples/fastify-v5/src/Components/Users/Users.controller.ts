import {FastifyReply,FastifyRequest} from "fastify";
import {Inject,Controller,DELETE,ErrorHandler,GET,POST} from "fastify-decorators";
import UsersService from "./Users.service.js";
import * as Schema from "./Users.schema.js";
import {UserAlreadyExistError,UserNotFoundError} from "../../Errors";


@Controller("/users")
export default class UsersController {

    @Inject(UsersService)
    readonly service!:UsersService;

    @GET("/:username",{schema:Schema.Endpoint})
    async getUser(request:FastifyRequest<{Params:{username:string}}>,response:FastifyReply){
        const {username}=request.params;
        const exists=await this.service.findUser(username);
        if(exists) response.send({username});
        else throw UserNotFoundError;
    }

    @DELETE("/:username")
    async deleteUser(request:FastifyRequest<{Params:{username:string}}>,response:FastifyReply){
        const {username}=request.params;
        const exists=await this.service.findUser(username);
        if(exists){
            this.service.deleteUser(username);
            response.status(204).send();
        }
        else throw UserNotFoundError;
    }

    @POST("/",{schema:Schema.Endpoint})
    async createUser(request:FastifyRequest<{Body:{username:string}}>,response:FastifyReply){
        const {username} = request.body;
        const exists=await this.service.findUser(username);
        if(exists) throw UserAlreadyExistError;
        else response.status(200).send({username});
    }

    @ErrorHandler(UserAlreadyExistError.code)
    userExists(error:Error,request:FastifyRequest,response:FastifyReply){
        response.status(422).send({message:"User already exists"});
    }

    @ErrorHandler(UserNotFoundError.code)
    public notExists(error:Error,request:FastifyRequest,response:FastifyReply){
        response.status(404).send({message:"User not found"});
    }
}


