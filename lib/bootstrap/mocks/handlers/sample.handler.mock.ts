import { RequestHandler } from '../../../interfaces/request-handler.js';
import { GET } from '../../../decorators/request-handlers.js';

@GET('/index')
export default class SampleHandler extends RequestHandler {
  async handle(): Promise<{ message: string }> {
    return { message: 'ok' };
  }
}
