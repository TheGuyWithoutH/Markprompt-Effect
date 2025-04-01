# Markprompt-Effect Test

To install dependencies:

```bash
bun install
```

To run:

```bash
cd packages/client && npm run build
cd ../..
npm run start
```

This project was created using `bun init` in bun v1.2.5. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Rate Limiting Strategy

I used the Sliding Log strategy for rate limiting. The algorithm is simple: it keeps track of the timestamps of requests made in the last minute and allows a maximum of {n} requests per minute. If the number of requests exceeds the limit, the server will return a 429 status code.

There are 3 tiers, but for now the only piece missing is that we cannot change the user tier. But the rate limiting is adaptable to any limit number.

## Effect

I used dependency injection for Redis to provide a way to test it later with a mock.
I also experimented with the declarative way of using Effect with pipes instead of generators.
