import { CREATOR } from 'fastify-decorators/plugins';
import { InjectableService } from '../interfaces/injectable-class.js';
import { FASTIFY_REPLY, FASTIFY_REQUEST, FastifyReplyToken, FastifyRequestToken } from '../symbols.js';

export type InjectablesMap = Map<string | symbol | unknown, InjectableService>;

export class _InjectablesHolder {
  declare userProvided: InjectablesMap;
  declare autoGenerated: InjectablesMap;
  constructor() {
    this.reset();
  }

  injectService(token: unknown, service: unknown, userProvided = true): void {
    this.verifyInjectable(service);

    if (userProvided) this.userProvided.set(token, service);
    else this.autoGenerated.set(token, service);
  }

  injectSingleton(token: unknown, singleton: unknown, userProvided = true): void {
    if (userProvided) this.userProvided.set(token, this.wrapSingleton(singleton));
    else this.autoGenerated.set(token, this.wrapSingleton(singleton));
  }

  has(token: unknown): boolean {
    return this.userProvided.has(token) || this.autoGenerated.has(token);
  }

  get(token: unknown): InjectableService | undefined {
    if (this.userProvided.has(token)) return this.userProvided.get(token);
    if (this.autoGenerated.has(token)) return this.autoGenerated.get(token);
  }

  reset(): void {
    this.autoGenerated = new Map([
      [FastifyRequestToken, this.wrapSingleton(FASTIFY_REQUEST)],
      [FastifyReplyToken, this.wrapSingleton(FASTIFY_REPLY)],
    ]);
    this.userProvided = new Map();
  }

  *entries(): IterableIterator<[unknown, InjectableService]> {
    yield* this.autoGenerated.entries();
    yield* this.userProvided.entries();
  }

  verifyInjectable(injectable: unknown): asserts injectable is InjectableService {
    if (typeof injectable !== 'function') throw new Error(`Injectable service expected, got ${typeof injectable}`);
    if (!(CREATOR in injectable)) {
      throw new Error(`Injectable service expected, got ${injectable.name}`);
    }
  }

  wrapSingleton<T>(object: T): InjectableService {
    return <InjectableService>(<unknown>{
      [CREATOR]: {
        register() {
          return object;
        },
      },
    });
  }
}

export const _injectablesHolder = new _InjectablesHolder();