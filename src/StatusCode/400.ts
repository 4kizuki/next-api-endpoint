import { RouteError } from './RouteError';

export class HTTP400BadRequest extends RouteError {
  protected STATUS_CODE = 400;
}

export class HTTP401Unauthorized extends RouteError {
  protected STATUS_CODE = 401;
}

export class HTTP402PaymentRequired extends RouteError {
  protected STATUS_CODE = 402;
}

export class HTTP403Forbidden extends RouteError {
  protected STATUS_CODE = 403;
}

export class HTTP404NotFound extends RouteError {
  protected STATUS_CODE = 404;
}

// HTTP 405 Method Not Allowed should be handled in APIRoute function

export class HTTP406NotAcceptable extends RouteError {
  protected STATUS_CODE = 406;
}

export class HTTP409Conflict extends RouteError {
  protected STATUS_CODE = 409;
}

export class HTTP410Gone extends RouteError {
  protected STATUS_CODE = 410;
}

export class HTTP415UnsupportedMediaType extends RouteError {
  protected STATUS_CODE = 415;
}

export class HTTP417ExpectationFailed extends RouteError {
  protected STATUS_CODE = 417;
}

/** @deprecated */
export class HTTP418ImATeapot extends RouteError {
  protected STATUS_CODE = 418;
}

export class HTTP422UnprocessableContent extends RouteError {
  protected STATUS_CODE = 422;
}

export class HTTP429TooManyRequests extends RouteError {
  protected STATUS_CODE = 429;
}
