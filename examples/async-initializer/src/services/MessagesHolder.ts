import { Service } from '@fastify-decorators/simple-di';

@Service()
export class MessagesHolder {
  private _messages: string[] = [];

  add(...messages: string[]): void {
    this._messages.push(...messages);
  }

  retrieve(): string[] {
    return [...this._messages];
  }
}
