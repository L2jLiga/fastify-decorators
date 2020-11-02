import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, ControllerType, GET, Hook } from 'fastify-decorators';

@Controller({
    route: '/stateful/hooks',
    type: ControllerType.SINGLETON,
})
export default class StatefulController {
    @GET()
    async getStateful(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        reply.status(204);
    }

    @Hook('onSend')
    async setPoweredBy(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        reply.header('X-Powered-By', 'Tell me who');
    }
}
