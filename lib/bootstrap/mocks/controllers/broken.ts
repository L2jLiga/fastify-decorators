import { Controller } from '../../../decorators/controller';
import { GET } from '../../../decorators/request-handlers';

@Controller('/broken')
export class Broken {
    @GET()
    get() {
        return 0;
    }
}
