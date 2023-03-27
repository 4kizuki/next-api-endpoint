import { NextApiResponse } from 'next';

export abstract class RouteError extends Error {
  protected abstract STATUS_CODE: number;
  public constructor(message: string = '') {
    super(message);
    this.name = this.constructor.name;
  }

  public send(res: NextApiResponse) {
    res.status(this.STATUS_CODE).send(this.message && { message: this.message });
  }
}
