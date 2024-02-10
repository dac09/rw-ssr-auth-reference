import { MetaHook } from '@redwoodjs/web'

import { db } from '$api/src/lib/db'

export async function routeParameters() {
  return (await db.post.findMany({ take: 7 })).map((post) => ({ id: post.id }))
}

export const meta: MetaHook = async () => {
  return [
    {
      title: 'Bazinga',
    },
    {
      name: 'Kris Meta',
      content: 'Kris Content',
    },
  ]
}
