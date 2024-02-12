## What is this?
This repo houses three sample (test-project) Redwood apps with SSR-streaming experiment enabled.

This is not a monorepo really, they are just individual projects in the `supabase`, `firebase` and `dbAuth` folders.

In each case you have:
- Auth middleware implemented in `web/src/entry.server.tsx`. This is where you should be looking!
	1. [Firebase](firebase/web/src/entry.server.tsx)
	1. [Supabase](supabase/web/src/entry.server.tsx)
	1. [dbAuth](dbAuth/web/src/entry.server.tsx)

- Expects the projects are running against the branch here: https://github.com/redwoodjs/redwood/pull/9962 - I usually do a `yarn rwfw project:sync`
- Demonstrates how we can use cookies to do auth on the server for streaming and RSC

This is not the final implementation, but serves as a reference for us to implement other auth providers.

## Why these three auth providers?

The way auth works with these providers is very different to one another:
- *dbAuth*: no external api call, and setting and unsetting the cookie via middleware. Sessions do not expire, so no refresh capability.
- *firebase*: external api call to get an idToken, which then gets converted to a session cookie in the middleware. No refresh capability.
- *supabase*: external api call to set cookie directly. The web client also sets the "auth-provider" cookie, so the API side knows how to decode it. I **think** that refreshing happens automatically by the supabase client.

For other providers we may need to do a Authorization token flow, which we also have the capability for, using middleware and `MiddlewareResponse.redirect()`

## Things to call out

### Common
1. The tsconfig has moduleResolution set to Node16. This is because of how we export things from middleware!

### Firebase
1. Notice how `getAdminApp` is a function, rather than a const export from `firebase/api/src/lib/auth`. This is because we get "double instantiation" errors if we don't do it this way (not sure why... maybe a Vite dev thing.)
2. We have a new 2 week expiry limit, this is a firebase restriction.

We also reuse the same admin app between the web and api sides

### Supabase
1. Remember to unpause whatever project you are using on supabase!!
2. We go through a lot of hooops to pull out the token just to pass to the authDecoder. I wonder if there's a better way here.
3. Notice where `createBrowserClient` is imported from in `supabase/web/src/auth.ts` This is so that supabase itself sets the cookie for us. The new `@supabase/ssr` package is the key!

### DbAuth
1. Notice how we had to create a "shared" handler in `dbAuth/web/src/authHandler.ts`. This is so that we share the same options as the auth function for dbAuth. I haven't tried removing this handler just yet - but don't think its necessary because middleware should be able to handle everything.


