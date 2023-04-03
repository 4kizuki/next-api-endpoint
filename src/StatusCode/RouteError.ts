import { Sendable } from '../types';

export abstract class RouteError extends Error {
  protected abstract STATUS_CODE: number;
  public constructor(message: string = '') {
    super(message);
    this.name = this.constructor.name;
  }

  public send(res: Sendable) {
    res.status(this.STATUS_CODE);
    if (this.message) {
      res.send({ message: this.message });
    } else {
      res.end();
    }
  }
}
