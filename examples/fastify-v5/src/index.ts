import "reflect-metadata";
import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import DecoratorsPlugin from "fastify-decorators";


export const app=Fastify();

const host="127.0.0.1";
const port=3001;
app.register(fastifyCookie);
app.register(DecoratorsPlugin,{
    directory:__dirname,
});

app.decorateRequest("user");

if(require.main===null){
    app.listen({host,port},(error,address)=>{
        if(error!=null) {
            console.error(error);
            process.exit(-1);
        }
        console.log(`Application start and listening at ${address}`);
        console.log(`Available routes: \n${app.printRoutes()}`);
    });
}

declare module "fastify" {
    interface FastifyRequest {
        user:string,
    }
}
