import { Service } from 'typedi';

@Service()
export class InjectableService {
  private _message = 'Message';

  getMessage(): string {
    return this._message;
  }
}
