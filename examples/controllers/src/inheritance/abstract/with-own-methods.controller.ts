import { Controller, GET } from 'fastify-decorators';
import { AbstractParent } from './abstract-parent.js';

@Controller('/abstract/own-methods')
export default class WithOwnMethodsController extends AbstractParent {
  message = 'Inherited';

  @GET('/pong')
  async pingPong() {
    return 'PING!';
  }
}
