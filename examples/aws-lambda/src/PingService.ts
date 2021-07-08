import { Service } from 'fastify-decorators';

@Service()
export class PingService {
  async pong(): Promise<{ message: string }> {
    return { message: 'ok' };
  }
}
