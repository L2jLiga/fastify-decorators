import { Controller, GET } from 'fastify-decorators';
import { Nested1Service } from '../services/Nested1Service.js';

@Controller('/test')
export class TestController {
  constructor(private service: Nested1Service) {}

  @GET('/nested-1')
  replyFromNested1() {
    this.service.replyWithHttp();
  }

  @GET('/nested-2')
  replyFromNested2() {
    this.service.replyFromNested();
  }

  @GET('/nested-3')
  replyFromNested3() {
    this.service.replyFromNested2();
  }
}
