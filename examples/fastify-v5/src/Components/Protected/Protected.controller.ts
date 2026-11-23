import {POST,GET,Controller} from "fastify-decorators";
import {AdminOnly,Authenticated} from "../../Hooks";
import * as Schema from "./Protected.schema";


@Controller({
    type:"perRequest",
    route:"/protected",
    hooks:[Authenticated],
})
export default class ProtectedController {

    @POST("/admin",{
        hooks:[AdminOnly],
        schema:Schema.Endpoint,
    })
    async manageSomeConfig(){
        return {ok:true};
    }

    @GET("/authenticated",{schema:Schema.Endpoint})
    async getSensitiveData(){
        return {ok:true};
    }
}