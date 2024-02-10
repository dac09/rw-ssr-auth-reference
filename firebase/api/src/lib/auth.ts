import admin from 'firebase-admin'

import { AuthenticationError } from '@redwoodjs/graphql-server'

// Use a function here, because otherwise (atleast in dev)
// It complains about the app already being initialized on the FE server
export const getAdminApp = () => {
  if (admin.apps.length === 0) {
    return admin.initializeApp({
      credential: admin.credential.cert({
        type: 'service_account',
        project_id: 'ssr-firebase-auth-2ef2c',
        private_key_id: 'c2e678502f84050d27fb3ac7a3ba4062f2d302c5',
        private_key:
          '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDZbcajVboAxlM+\n5HmZeaGpZaAjV1+b0+TntjTHkDYghuFBRmhJpzEwfM3Uw/S2aqDa7zl/f90xm7Ua\nvB0Xd4YCKX7D4JH8TXNuTqYx3tuEd/IRLK7uRLbpX3Lsp/0/s/XPhEMJC9wPSL/4\nQjA4p7prJN7AscOR6t6Yf6JnHC7pkQXwBjvWxjcB/FDz6dJOA60JBl2Rgg/vbeAX\nTXPBCgHdDy4fyYkq2n2UhQHpU/iGJQ/AClCLCuNpnvIBADFkd6NtvTCM98pzCnwA\nZiqTGJdq8xv+zsHF0gNiLPdytddZs5MIxA8PD8tNpAp+sW4ovC8aEjQI/UkRvYfJ\n45CTpi0DAgMBAAECggEACthHtEWQ3FFdZ+wpHTIXZvsbfy0a/DXtRhoXoi07veiX\nBf9MhqvxBKbySfP82eJnTomTF8cZZyGJ6XZLidbw110Ze7dQ9hbTie4gqlPK0DMp\nXu5DIBL2VUfo/raBp7KYBqHlXrykMnD2/kYoNeiLyvn7pactht2CUnSUoEmkFLXg\nUvWGh3wG/JQRN0EFsejezdZ0unBlCQGb3HOQj3Mj63EHAmBMCQ2H0XEl0PgLt0hA\nYxJe0kGRcu6XAexSydYYo0p7Fg5lzpQJbC3Pax7JMl8kN98v3+IcKoL80RAMneop\ndLBEVOMqsYsYGl3qKlOuqolEQYBE1dtBOomv5a0RgQKBgQD7WnIdCm62VW0sX7uE\n3Z9YiTKDhvCwzIzG97fHb770PY6yA2C65rAlcjpOipxmWpZX6SLu9p7NQkCPmVwW\nyBhShp5yifqbLaC9c+4bMQIqJKcBsTsl9mRM5rvpZeYfMVWWlETBxIL6cS/EpgfD\nADQhdkQ7ccfnZzm4ICu1SCy+gQKBgQDdcsd4UzJOGaKe0SuADJY9SeMUMt1Tl6zp\nS0cEdd0ifNn6IMVk/vtMxG73cWtNq7J0sqZV5p91W/RWRyqbbVpbqr4fqwdtt20p\n/lxKJri5R8juMoaq1AmOfh5Qp0KHW2F+j8yBm1vPaK52eF9iR6x7yVKqrAaCbmaX\nxmoRg0oxgwKBgC25bFzgEvfUXoHeAGzRLDWc77WBjLN84ncnhSUgrOodcKHtf2FA\nqfaF6xlymbT88bCYVqSF9Kl+TeRRj7ENQW9x0c0gUJh+Gmmcd0o3Bh/IfyENrqbf\nRau/pZt10AEIpns4CbH+H52TjY8GbQ8KMHGN5Ce0MRtladiW8ZyOvqUBAoGBAJn8\nqoAdOinc4ZwWT21nU0GjE2iERitOmUpQsj2DyBWnQ9wO1bR5Kj4jihY+pCMKdbl4\nUPoCuHdfTfSA4DvcOqzrefGDeFLu7dX5ritR6bnNFQet0r8PWuXfBS2IYVbGUHE1\nhTvK0HjVjhuLcKhitqoNQJK1tIEWS/jWXAN5jCoJAoGBAI9XumFRU6o51Fi1PLV+\n6tQ7D9fbigXto8fSvYsyJ9vYCKgYIttjhQYul9kMX0Cb8YznoJjL3YHKXyZmljjL\nEdnvnc/+MEPBXLF1vTHX6FPxvK1QFTNF2EDoGd7gyy64ENEWlSVeX8la0hrhpOwC\nhPsZBjsVj9iEGTET1sCANiha\n-----END PRIVATE KEY-----\n',
        client_email:
          'firebase-adminsdk-fqgda@ssr-firebase-auth-2ef2c.iam.gserviceaccount.com',
        client_id: '105297932256304061020',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url:
          'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url:
          'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fqgda%40ssr-firebase-auth-2ef2c.iam.gserviceaccount.com',
        universe_domain: 'googleapis.com',
      }),
    })
  } else {
    return admin.app()
  }
}

/**
 * getCurrentUser returns the user information from the decoded JWT
 *
 * @param decoded - The decoded access token containing user info and JWT claims like `sub`. Note could be null.
 * @param { token, SupportedAuthTypes type } - The access token itself as well as the auth provider type
 * @param { APIGatewayEvent event, Context context } - An object which contains information from the invoker
 * such as headers and cookies, and the context information about the invocation such as IP Address
 *
 * !! BEWARE !! Anything returned from this function will be available to the
 * client--it becomes the content of `currentUser` on the web side (as well as
 * `context.currentUser` on the api side). You should carefully add additional
 * fields to the return object only once you've decided they are safe to be seen
 * if someone were to open the Web Inspector in their browser.
 *
 * @see https://github.com/redwoodjs/redwood/tree/main/packages/auth for examples
 */
export const getCurrentUser = async (
  decoded,
  /* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
  { token, type },
  /* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
  { event, context }
) => {
  return decoded
}

/**
 * The user is authenticated if there is a currentUser in the context
 *
 * @returns {boolean} - If the currentUser is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!context.currentUser
}

/**
 * Call requireAuth in your services, or use the @requireAuth directive to check that a user is logged in,
 * and raise an error if they're not.
 *
 * @returns - If the currentUser is authenticated
 *
 * @throws {@link AuthenticationError} - If the currentUser is not authenticated
 *
 * @see https://github.com/redwoodjs/redwood/tree/main/packages/auth for examples
 */
export const requireAuth = () => {
  if (!isAuthenticated()) {
    throw new AuthenticationError("You don't have permission to do that.")
  }

  // Custom RBAC implementation required for firebase
  // https://firebase.google.com/docs/auth/admin/custom-claims
}
