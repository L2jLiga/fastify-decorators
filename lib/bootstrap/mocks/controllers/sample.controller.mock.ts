import { Controller, GET } from '../../../decorators/index.js';

@Controller()
export default class SampleControllerMock {
  @GET('/index')
  async getAll(): Promise<{ message: string }> {
    return { message: 'ok' };
  }
}
