import { Controller } from 'fastify-decorators';
import { AbstractParent } from './abstract-parent.js';

@Controller('/abstract/inherited')
export default class InheritedController extends AbstractParent {
  message = 'Inherited';
}
