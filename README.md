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
4. When you login with supabase, it doesn't automatically redirect away from the login page. I'm not sure why this is happening
5. The auth-provider cookie set in the WEB auth client. i.e. client side. I'm not 100% sure this is the best solution, we could implement the token swap mechanism we have in firebase too.
6. The shape of the decoded token returned from supabase is not exactly the same.

<details>
<summary>See the two types of decoded responses 👇</summary>
Old decoded token for example:
<code>
{
  "aud": "authenticated",
  "exp": 1708340101,
  "iat": 1707735301,
  "iss": "https://pmavftcsgoonzlgqkken.supabase.co/auth/v1",
  "sub": "cf071c32-20db-4f23-be69-c8b8420063a0",
  "email": "dannychoudhury@gmail.com",
  "phone": "",
  "app_metadata": {
    "provider": "email",
    "providers": [
      "email"
    ]
  },
  "user_metadata": {},
  "role": "authenticated",
  "aal": "aal1",
  "amr": [
    {
      "method": "otp",
      "timestamp": 1707555518
    }
  ],
  "session_id": "8f026cf0-b346-467c-9e0b-75716b4fdaff"
}
</code>
New:
<code>
{
   id: '75fd8091-e0a7-4e7d-8a8d-138d0eb3ca5a',
   aud: 'authenticated',
   role: 'authenticated',
   email: 'dannychoudhury+1@gmail.com',
   email_confirmed_at: '2023-11-15T08:13:43.982687Z',
   phone: '',
   confirmation_sent_at: '2023-11-15T08:13:24.695281Z',
   confirmed_at: '2023-11-15T08:13:43.982687Z',
   last_sign_in_at: '2024-02-12T10:41:56.353527Z',
   app_metadata: { provider: 'email', providers: [ 'email' ] },
   user_metadata: { 'full-name': 'Danny Choudhury 1' },
   identities: [
     {
       identity_id: 'c59f188e-5c92-40b1-b7e3-26ba31222cee',
       id: '75fd8091-e0a7-4e7d-8a8d-138d0eb3ca5a',
       user_id: '75fd8091-e0a7-4e7d-8a8d-138d0eb3ca5a',
       identity_data: [Object],
       provider: 'email',
       last_sign_in_at: '2023-11-15T08:13:24.691649Z',
       created_at: '2023-11-15T08:13:24.691692Z',
       updated_at: '2023-11-15T08:13:24.691692Z',
       email: 'dannychoudhury+1@gmail.com'
     }
   ],
   created_at: '2023-11-15T08:13:24.686262Z',
   updated_at: '2024-02-12T10:41:56.355166Z'
 }
</code>
</details>



### DbAuth
1. Notice how we had to create a "shared" handler in `dbAuth/web/src/authHandler.ts`. This is so that we share the same options as the auth function for dbAuth. I haven't tried removing this handler just yet - but don't think its necessary because middleware should be able to handle everything.
2. In [web/src/auth.ts](dbAuth/web/src/auth.ts) for dbAuth - I'm overriding the auth URL - so it hits middleware instead of the api side dbAuth function
3. dbAuth and firebase both use the cookie "session" to store sessions. So if you logged in firebase, dbAuth could error out. This is because the dbAuth middleware doesn't log you out automatically on exceptions (but firebase does). Just something I haven't gotten round to.


