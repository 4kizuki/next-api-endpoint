# Next API Composer

Your implementations of [API Routes](https://nextjs.org/docs/api-routes/introduction) for your [Next.js](https://nextjs.org) applications will be much easier with this library.

You have to code the API Routes like:

```ts
// api/example.ts
export default async (req, res) => {
  if (req.method === 'GET') {
    // do something
    res.json({ foo: 'bar' });
    return;
  }

  res.setHeader('Allow', 'GET');
  if (req.method === 'OPTIONS') {
    res.status(204).send(null);
  } else {
    res.status(405).send(null);
  }
};
```

With this library:

```ts
// api/example.ts
export default nextApi({
  GET: async (req, res) => {
    // do something
    res.json({ foo: 'bar' });
  },
});
```

## Installation

- `npm i next-api-composer`

## Supported Methods

- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`

## HTTP Error Handling

- This library includes various HTTP Error types such as `HTTP400BadRequest`, which extends `RouteError`.
- `RouteError` has a method `send(res: Sendable)`.
- If any errors extending `RouteError` is thrown in the handler, they'll be handled with calling the `send` method of the error.
- If any errors other than `RouteError` is thrown in the handler, the handler will emit HTTP 500 error.
- For details, see `src/index.ts`.

```ts
// api/example.ts
export default nextApi({
  GET: async (req, res) => {
    // Given, the function authenticate will return false
    // if the request does not have a valid token in its HTTP header.
    if (!authenticate(req)) {
      throw new HTTP401Unauthorized();
    }

    // do something
    res.json({ foo: 'bar' });
  },
});
```
