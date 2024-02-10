import { createServerClient } from '@supabase/ssr'
import cookie from 'cookie'

import { authDecoder } from '@redwoodjs/auth-supabase-api'

import App from './App'
import { Document } from './Document'

import { getCurrentUser } from '$api/src/lib/auth'

interface Props {
  css: string[]
  meta?: any[]
}

export const middleware = async (req: Request) => {
  const cookieHeader = req.headers.get('Cookie')
  console.log(`👉 \n ~ file: entry.server.tsx:17 ~ cookieHeader:`, cookieHeader)

  if (!cookieHeader) {
    return {
      context: {
        loading: false,
        isAuthenticated: false,
        userMetadata: null,
        currentUser: null,
        hasError: false,
      },
    }
  }

  const parsedCookie = cookie.parse(cookieHeader)
  // @MARK: problem here, is that we don't know the name of the cookie
  // so we have to use the supabase server client to get the cookie 🤷
  console.log(`👉 \n ~ file: entry.server.tsx:31 ~ parsedCookie:`, parsedCookie)

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
    {
      cookies: {
        get(key) {
          return parsedCookie[key]
        },
      },
    }
  )

  // @MARK: we're getting the user from supabase ssr auth directly
  // Should we be using the authDecoder and getCurrentUser functions to maintain consistency?
  const user = await supabase.auth.getUser()
  const seshun = await supabase.auth.getSession()
  console.log(`👉 \n ~ file: entry.server.tsx:52 ~ seshun:`, seshun)
  console.log(`👉 \n ~ file: entry.server.tsx:51 ~ user:`, user)

  // @TODO: why is the type definition requesting req? It's not used.
  // See definition of supabase authDecoder
  // const decodedSession = authDecoder(accessToken, 'supabase', {
  //   event: {},
  //   context: {},
  // })

  // @TODO: getCurrentUser in template destructures event and context
  // this is problematic, as these values are now different between api and web server.
  // const currentUser = await getCurrentUser(decodedSession, {
  //   token: accessToken,
  //   type: 'supabase',
  // })

  // console.log(`👉 \n ~ file: entry.server.tsx:29 ~ currentUser:`, currentUser)

  return {
    context: {
      currentUser: user.data.user,
      loading: false,
      isAuthenticated: !!user.data.user,
      hasError: false,
      userMetadata: user.data.user.user_metadata, // where does this come from?
      encryptedSession: seshun.data.session.access_token,
    },
  }
}

export const ServerEntry: React.FC<Props> = ({ css, meta }) => {
  return (
    <Document css={css} meta={meta}>
      <App />
    </Document>
  )
}
