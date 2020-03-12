import { GET } from '../../../decorators/request-handlers';
import { RequestHandler } from '../../../interfaces';

@GET('/index')
export default class SampleHandler extends RequestHandler {
    async handle(): Promise<{ message: string }> {
        return { message: 'ok' };
    }
}
