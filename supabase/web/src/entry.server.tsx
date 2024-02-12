
import { authDecoder } from '@redwoodjs/auth-supabase-api'
import { MiddlewareRequest, MiddlewareResponse } from '@redwoodjs/vite/middleware'

import App from './App'
import { Document } from './Document'

import { getCurrentUser } from '$api/src/lib/auth'

interface Props {
  css: string[]
  meta?: any[]
}

export const middleware = async (req: MiddlewareRequest) => {
  const mwRes = MiddlewareResponse.next()

  const cookieHeader = req.headers.get('Cookie')

  // Unauthenticated request
  if (!cookieHeader) {
    return null
  }

  // @NOTE to maintain compatibility with the api side,
  // we need to pass the whole cookieString to the authDecoder
  // This is because we don't know what the name of the cookie is!
  const cookieString = req.headers.get('cookie')

  // @WARN: Authdecoders still take event and context
  // @TODO: is the decodedSession the same as jwt.decode?
  try {
    const decodedSession = await authDecoder(cookieString, 'supabase', {
      event: {} as any,
      context: {} as any,
    })
  } catch (e) {
    // @TODO, @MARK Unsure what to do if authDecoding fails.
    // unlike firebase, and dbauth - where we unset the cookie, supabase itself sets these cookies
    console.error('Failed to decode session in middleware')
  }


  // @MARK @WARN getCurrentUser in template destructures event and context
  // this is problematic, as these values are now different between api and web server.
  const currentUser = await getCurrentUser(decodedSession, {
    token: cookieString,
    type: 'supabase',
  })

  req.serverAuthContext.set({
    currentUser,
      loading: false,
    isAuthenticated: !!currentUser,
      hasError: false,
    userMetadata: currentUser.user_metadata, // where does this come from?
    cookieHeader: cookieString,
  })

  return mwRes
}

export const ServerEntry: React.FC<Props> = ({ css, meta }) => {
  return (
    <Document css={css} meta={meta}>
      <App />
    </Document>
  )
}
