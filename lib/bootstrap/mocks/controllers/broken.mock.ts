import { Controller, GET } from '../../../decorators/index.js';

@Controller('/broken')
export class BrokenMock {
  @GET()
  get(): number {
    return 0;
  }
}
