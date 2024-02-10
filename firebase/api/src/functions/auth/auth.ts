import type { APIGatewayEvent, Context } from 'aws-lambda'
import cookie from 'cookie'

import { adminApp } from 'src/lib/auth'

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  const { idToken } = JSON.parse(event.body)

  const expiresIn = 60 * 60 * 24 * 5 * 1000

  const sessionCookie = await adminApp.auth().createSessionCookie(idToken, {
    expiresIn,
  })

  const cookieHeader = cookie.serialize('session', sessionCookie, {
    expires: new Date(Date.now() + expiresIn),
    httpOnly: true,
    secure: true,
    path: '/',
  })

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookieHeader,
    },
    body: JSON.stringify({
      data: 'auth function',
    }),
  }
}
