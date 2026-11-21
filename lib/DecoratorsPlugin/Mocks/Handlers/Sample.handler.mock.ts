import {GET} from "../../../Decorators/index.js";
import {RequestHandler} from "../../../Interfaces/index.js";


@GET("/index")
export default class SampleHandler extends RequestHandler {

    async handle():Promise<{ message:string }> {
        return { message:"ok" };
    }

}
