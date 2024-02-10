import { setTimeout } from 'node:timers/promises'

import type {
  QueryResolvers,
  MutationResolvers,
  PostRelationResolvers,
} from 'types/graphql'

// import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

export const posts: QueryResolvers['posts'] = async () => {
  // Simulate error to see if message actually comes through
  // throw new AuthenticationError('bazinga')

  return db.post.findMany()
}

export const post: QueryResolvers['post'] = async ({ id }) => {
  // await setTimeout(5000)

  return db.post.findUnique({
    where: { id },
  })
}

export const createPost: MutationResolvers['createPost'] = ({ input }) => {
  return db.post.create({
    data: input,
  })
}

export const updatePost: MutationResolvers['updatePost'] = ({ id, input }) => {
  return db.post.update({
    data: input,
    where: { id },
  })
}

export const deletePost: MutationResolvers['deletePost'] = ({ id }) => {
  return db.post.delete({
    where: { id },
  })
}

export const Post: PostRelationResolvers = {
  author: (_obj, { root }) => {
    return db.post.findUnique({ where: { id: root?.id } }).author()
  },
}
