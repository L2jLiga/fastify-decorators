import {Controller,GET} from "../../../Decorators/index.js";


@Controller("/broken")
export class BrokenMock {
    @GET()
    get():number {
        return 0;
    }
}
