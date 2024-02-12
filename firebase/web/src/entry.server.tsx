import cookie from 'cookie'

import { authDecoder } from '@redwoodjs/auth-firebase-api'

import App from './App'
import { Document } from './Document'
import { MiddlewareRequest, MiddlewareResponse } from '@redwoodjs/vite/middleware'
import { getCurrentUser, getAdminApp } from '$api/src/lib/auth'
import { LocationProvider } from '@redwoodjs/router'

interface Props {
  css: string[]
  meta?: any[]
}

export const middleware = async (req: MiddlewareRequest) => {
  // @MARK: using getter here...... talk about this!
  const adminApp = getAdminApp()

  // PART 1: Setting the cookie on login
  // If its a token to cookie swap request, should be called after login with firebase
  // assumes the idToken is in the body
  if (req.method === 'POST') {
    if (req.url.includes('logout')){
      return createLogoutResponse(req)
    }


    const { idToken } = await req.json()
    // 2 weeks
    const expiresIn = 12096e5

    const sessionCookie = await adminApp.auth().createSessionCookie(idToken, {
      expiresIn,
    })

    // @MARK: our middleware handling will need to be updated.
    // this is not a redirect, but should not be rendered by react
    // maybe we have a MwRes.intercept() method?

    const createSeshunResponse = new MiddlewareResponse('TODO, SEND CURRENTUSER')

    createSeshunResponse.cookies.set('session', sessionCookie, {
      expires: new Date(Date.now() + expiresIn),
      httpOnly: true,
      secure: true,
    })

    createSeshunResponse.cookies.set('auth-provider', 'firebase', {
      httpOnly: false,
      expires: new Date(Date.now() + expiresIn),
    })

    return createSeshunResponse
  }

  const mwRes = MiddlewareResponse.next()



  const cookieHeader = req.headers.get('cookie')

  // PART 2: no auth
  if (!cookieHeader) {
    // If there's no cookie header, there's no session
    return
  }


  // PART 3: validate cookie & setting auth context,
  try {
    // @MARK: Pass ALL the cookies in, to maintain compatibility with supabase for example
    const decodedToken = await authDecoder(cookieHeader, 'firebase', {} as any)

    // @MARK: Note the second and third params
    // We need to decide what the new shape of getCurrentUser will be
    const currentUser = await getCurrentUser(decodedToken, { token: cookieHeader, type: 'firebase' }, {} as any)



    req.serverAuthContext.set({
      currentUser,
      loading: false,
      isAuthenticated: !!currentUser,
      hasError: false,
      userMetadata: null,
      cookieHeader,
    },)

    console.log('sssssss auth state', req.serverAuthContext.get())
  } catch (e) {
    console.error('Error verifying cookie >> \n', e)

    // PART 4: if cookie is invalid, clear it
    // For now I'm not doing a redirect...

    // Set it to null, so default auth state takes over

    return createLogoutResponse(req)
  }
  console.log(`👉 \n ~ req.serverAuthContext.get():`, req.serverAuthContext.get())
  console.log(`👉 \n ~  req.serverAuthContext.get():`, req.serverAuthContext.get())


  return mwRes
}

export const ServerEntry: React.FC<Props> = ({ css, meta }) => {
  return (
    <Document css={css} meta={meta}>
      <App />
    </Document>
  )
}

function createLogoutResponse(req: MiddlewareRequest) {
  req.serverAuthContext.set(null)
  const removeSeshunRes = MiddlewareResponse.next()
  removeSeshunRes.cookies.unset('session')
  removeSeshunRes.cookies.unset('auth-provider')
  return removeSeshunRes
}

