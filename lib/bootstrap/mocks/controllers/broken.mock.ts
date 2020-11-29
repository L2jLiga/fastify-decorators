import { Controller, GET } from '../../../decorators';

@Controller('/broken')
export class BrokenMock {
  @GET()
  get(): number {
    return 0;
  }
}
