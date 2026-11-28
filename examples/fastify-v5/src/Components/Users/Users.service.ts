import {Service} from "fastify-decorators";


@Service()
export default class UsersService {

    static readonly users=new Set<string>();

    async findUser(name:string){
        return UsersService.users.has(name);
    } 

    async deleteUser(name:string){
        UsersService.users.delete(name);
    }

    async clearAll(){
        UsersService.users.clear();
    }
}

