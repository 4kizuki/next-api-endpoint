export interface Sendable {
  status(statusCode: number): unknown;
  setHeader(name: string, value: string): unknown;
  send(body: unknown): unknown;
  end(): unknown;
}

export const methods = ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'] as const;
export type Method = (typeof methods)[number];

export type HandlerType<TReq, TRes> = (req: TReq, res: TRes) => unknown | Promise<unknown>;
