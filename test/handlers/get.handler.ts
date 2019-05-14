import { GET } from '../../lib/decorators';
import { RequestHandler } from '../../lib/interfaces';

@GET({
    url: '/get'
})
class GetHandler extends RequestHandler {
    async handle() {
        return {message: 'OK!'};
    }
}

export = GetHandler;
