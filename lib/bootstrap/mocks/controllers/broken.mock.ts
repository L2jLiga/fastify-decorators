import { Controller } from '../../../decorators/controller';
import { GET } from '../../../decorators/request-handlers.js';

@Controller('/broken')
export class BrokenMock {
  @GET()
  get(): number {
    return 0;
  }
}
