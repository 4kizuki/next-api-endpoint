import { NextApiRequest, NextApiResponse } from 'next';
import { RouteError } from './StatusCode/RouteError';
import { HandlerType, Method, methods, Sendable } from './types';

export function nextApi<
  TReq extends { method?: string } = NextApiRequest,
  TRes extends Sendable = NextApiResponse
>(handlers: {
  [key in Method]?: HandlerType<TReq, TRes>;
}): HandlerType<TReq, TRes> {
  const supported = methods.filter(m => handlers[m] !== undefined);

  if (supported.length === 0)
    return async (req, res) => {
      res.status(404);
      res.end();
      return;
    };

  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');

    try {
      // supported methods
      for (const method of supported) {
        if (req.method !== method) continue;
        const handler = handlers[method];
        if (!handler) break;
        return await handler(req, res);
      }

      // OPTIONS or unsupported Methods
      res.status(req.method === 'OPTIONS' ? 204 : 405);
      res.setHeader('Allow', supported.join(', '));
      res.end();
      return;
    } catch (e: unknown) {
      if (e instanceof RouteError) {
        e.send(res);
        return;
      }

      res.status(500);
      res.end();
      console.error('HTTP500 Internal Error (Uncaught Exception)', __filename, e);
      return;
    }
  };
}

export * from './StatusCode/400';
export * from './StatusCode/500';
export * from './StatusCode/RouteError';
