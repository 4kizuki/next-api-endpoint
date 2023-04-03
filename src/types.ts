export type Sendable = {
    status(statusCode: number): unknown;
    setHeader(name: string, value: string): unknown;
  send(body: unknown): unknown;
};
