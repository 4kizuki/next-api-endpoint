import { HTTP400BadRequest, HTTP401Unauthorized, HTTP500InternalError, nextApi } from '../src';
import { HandlerType, Method, methods, Sendable } from '../src/types';

type Request = { method?: string };
class TestSendable implements Sendable {
  public body: unknown;
  public headers = new Map<string, string>();
  public statusCode: number | null = null;
  public sent: boolean = false;

  send(body: unknown): void {
    this.body = body;
    this.sent = true;
  }

  setHeader(name: string, value: string): void {
    this.headers.set(name, value);
  }

  status(statusCode: number): void {
    this.statusCode = statusCode;
  }

  end(): void {
    this.sent = true;
  }
}

async function mockConsoleError(f: (expectation: ReturnType<typeof expect>) => void | Promise<void>) {
  const original = console.error;
  console.error = jest.fn();

  await f(expect(console.error));

  expect(console.error).toHaveBeenCalled();
  console.error = original;
}

describe('Route', () => {
  it('Routing', async () => {
    const handled: { [key in Method]?: boolean } = {};

    const handlers: { [key in Method]?: HandlerType<Request, Sendable> } = {};
    methods.forEach(method => {
      handlers[method] = async () => {
        handled[method] = true;
      };
    });

    const route = nextApi<Request, Sendable>(handlers);

    const sendable = new TestSendable();

    await route({ method: 'UNKNOWN' }, sendable);
    methods.forEach(method => {
      expect(handled[method]).toBe(undefined);
    });

    await route({ method: 'GET' }, sendable);
    expect(handled.GET).toBe(true);
    (['POST', 'PATCH', 'PUT', 'DELETE'] as const).forEach(method => {
      expect(handled[method]).toBe(undefined);
    });

    await route({ method: 'POST' }, sendable);
    expect(handled.POST).toBe(true);
    (['PATCH', 'PUT', 'DELETE'] as const).forEach(method => {
      expect(handled[method]).toBe(undefined);
    });

    await route({ method: 'PATCH' }, sendable);
    expect(handled.PATCH).toBe(true);
    (['PUT', 'DELETE'] as const).forEach(method => {
      expect(handled[method]).toBe(undefined);
    });

    await route({ method: 'PUT' }, sendable);
    expect(handled.PUT).toBe(true);
    (['DELETE'] as const).forEach(method => {
      expect(handled[method]).toBe(undefined);
    });

    await route({ method: 'DELETE' }, sendable);
    methods.forEach(method => {
      expect(handled[method]).toBe(true);
    });
  });

  it('Allow Header', async () => {
    const route = nextApi<Request, Sendable>({
      GET: async (req, res) => {},
    });

    {
      const sendable = new TestSendable();
      await route({ method: 'OPTIONS' }, sendable);

      expect(sendable.statusCode).toBe(204);
      expect(sendable.headers.get('Allow')).toBe('GET');
      expect(sendable.body).toBeUndefined();
    }

    {
      const sendable = new TestSendable();
      await route({ method: 'POST' }, sendable);

      expect(sendable.statusCode).toBe(405);
      expect(sendable.headers.get('Allow')).toBe('GET');
      expect(sendable.body).toBeUndefined();
    }
  });

  it('Erroneous', async () => {
    const M401 = 'Message # 401';
    const M500 = 'Message # 500';
    const route = nextApi<Request, Sendable>({
      GET: async (req, res) => {
        throw new HTTP400BadRequest();
      },
      PATCH: async (req, res) => {
        throw new HTTP401Unauthorized(M401);
      },
      POST: async (req, res) => {
        throw new Error();
      },
      PUT: async (req, res) => {
        throw new HTTP500InternalError(M500);
      },
    });

    {
      const sendable = new TestSendable();
      await route({ method: 'GET' }, sendable);

      expect(sendable.statusCode).toBe(400);
      expect(sendable.body).toBeUndefined();
    }

    {
      const sendable = new TestSendable();
      await route({ method: 'PATCH' }, sendable);

      expect(sendable.statusCode).toBe(401);
      expect(sendable.body).toEqual({ message: M401 });
    }

    await mockConsoleError(async expectation => {
      const sendable = new TestSendable();
      await route({ method: 'POST' }, sendable);

      expect(sendable.statusCode).toBe(500);
      expect(sendable.body).toBeUndefined();
      expectation.toBeCalled();
    });

    await mockConsoleError(async expectation => {
      const sendable = new TestSendable();
      await route({ method: 'PUT' }, sendable);

      expect(sendable.statusCode).toBe(500);
      expect(sendable.body).toBeUndefined();
      expectation.toBeCalled();
    });
  });
});
