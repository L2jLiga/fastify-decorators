import { Controller } from 'fastify-decorators';
import { Parent } from './parent.js';

@Controller('/parent/inherited')
export default class InheritedController extends Parent {
  message = 'Inherited';
}
