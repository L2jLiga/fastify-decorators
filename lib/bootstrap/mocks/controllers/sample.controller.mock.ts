import { Controller } from '../../../decorators/controller';
import { GET } from '../../../decorators/request-handlers';

@Controller()
export default class SampleControllerMock {
    @GET('/index')
    async getAll() {
        return { message: 'ok' };
    }
}
