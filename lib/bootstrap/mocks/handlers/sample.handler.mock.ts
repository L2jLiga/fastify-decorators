import { GET } from '../../../decorators/index.js';
import { RequestHandler } from '../../../interfaces/index.js';

@GET('/index')
export default class SampleHandler extends RequestHandler {
  async handle(): Promise<{ message: string }> {
    return { message: 'ok' };
  }
}
