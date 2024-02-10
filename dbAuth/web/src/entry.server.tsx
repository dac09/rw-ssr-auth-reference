import { Response } from '@whatwg-node/server'

import { decryptSession, getSession } from '@redwoodjs/auth-dbauth-api'
import { LocationProvider } from '@redwoodjs/router'
import { MiddlewareResponse } from '@redwoodjs/vite/middleware'
import { MiddlewareRequest } from '@redwoodjs/vite/middleware'

import App from './App'
import { handler } from './authHandler'
import { Document } from './Document'

import { getCurrentUser } from '$api/src/lib/auth'

interface Props {
  url: string
  css: string[]
  meta?: any[]
  children?: React.ReactNode
}

export const middleware = async (req: MiddlewareRequest) => {
  const res = MiddlewareResponse.next()

  // If it's a POST request, handoff the request to the dbAuthHandler
  // But.... we still need to convert tha Lambda style headers (because of multiValueHeaders)
  if (req.method === 'POST') {
    const output = await handler(req)

    const finalHeaders = new Headers()
    Object.entries(output.headers).forEach(([key, value]) => {
      finalHeaders.append(key, value)
    })

    Object.entries(output.multiValueHeaders).forEach(([key, values]) => {
      values.forEach((value) => finalHeaders.append(key, value))
    })

    return new MiddlewareResponse(output.body, {
      headers: finalHeaders,
      status: output.statusCode,
    })
  }

  const cookieHeader = req.headers.get('Cookie')

  if (!cookieHeader) {
    // Let the AuthContext fallback to its default value
    return res
  }

  const sessionStuff = getSession(cookieHeader, undefined)

  try {
    const [decryptedSession] = decryptSession(sessionStuff)

    const currentUser = await getCurrentUser(decryptedSession)

    req.serverAuthContext.set({
      currentUser,
      loading: false,
      isAuthenticated: !!currentUser,
      hasError: false,
      userMetadata: currentUser, // Not sure!
      cookieHeader,
    })
  } catch (e) {
    // Clear server auth context
    req.serverAuthContext.set(null)

    //  @TODO(Rob): Clear the cookie
    // We currently do not expose a way of removing cookies in dbAuth
  }

  return res
}

export const ServerEntry: React.FC<Props> = ({ url, css, meta, children }) => {
  return (
    <LocationProvider location={{ pathname: url }}>
      <Document css={css} meta={meta}>
        {children ? children : <App />}
      </Document>
    </LocationProvider>
  )
}
