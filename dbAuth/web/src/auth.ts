import { createDbAuthClient, createAuth } from '@redwoodjs/auth-dbauth-web'

const dbAuthClient = createDbAuthClient({
  dbAuthUrl: '/middleware',
})

export const { AuthProvider, useAuth } = createAuth(dbAuthClient)
