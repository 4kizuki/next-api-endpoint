import { RouteError } from './RouteError';
import { Sendable } from '../types';

export class HTTP500InternalError extends RouteError {
  protected STATUS_CODE = 500;

  public constructor(message: string, private readonly originalError?: Error) {
    super(message);
  }

  public send(res: Sendable) {
    res.status(this.STATUS_CODE);
    res.end();
    console.error('HTTP500 Internal Error (Thrown)', this.message, this.originalError);
  }
}

export class HTTP503ServiceUnavailable extends RouteError {
  protected STATUS_CODE = 503;
}
