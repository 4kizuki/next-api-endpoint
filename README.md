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
}
```

With this library:
```ts
// api/example.ts
export default nextApi({
  GET: async (req, res) => {
    res.json({ foo: 'bar' });
  }
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