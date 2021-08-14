import { Service } from '@fastify-decorators/simple-di';

@Service()
export class PingService {
  async pong(): Promise<{ message: string }> {
    return { message: 'ok' };
  }
}
