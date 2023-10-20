import { Controller, GET } from 'fastify-decorators';
import { Parent } from './parent.js';

@Controller('/parent/own-methods')
export default class WithOwnMethodsController extends Parent {
  message = 'OwnMethods';

  @GET('/pong')
  async pingPong() {
    return 'PING!';
  }
}
