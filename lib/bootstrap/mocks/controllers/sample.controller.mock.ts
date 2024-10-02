import { Controller } from '../../../decorators/controller';
import { GET } from '../../../decorators/request-handlers.js';

@Controller()
export default class SampleControllerMock {
  @GET('/index')
  async getAll(): Promise<{ message: string }> {
    return { message: 'ok' };
  }
}
