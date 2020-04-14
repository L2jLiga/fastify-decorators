import { Controller, GET } from '../../../decorators';

@Controller()
export default class SampleControllerMock {
    @GET('/index')
    async getAll() {
        return { message: 'ok' };
    }
}
